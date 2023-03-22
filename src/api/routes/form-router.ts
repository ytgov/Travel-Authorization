import express, { Request, Response } from "express";
import { ReturnValidationErrors } from "../middleware";
import { DB_CONFIG } from "../config";
import knex from "knex";
import { UserService, FormService, AuditService } from "../services";
import { v4 as uuid } from "uuid";
import * as formHelper from "../utils/formHelper";
import { auth } from "express-openid-connect";
import { report } from "process";
import { Form } from "../models/form";

const db = knex(DB_CONFIG);

const { setTypeParser, builtins } = require("pg").types;

const typesToReset = [builtins.DATE, builtins.TIME, builtins.TIMETZ, builtins.TIMESTAMP, builtins.TIMESTAMPTZ];

function resetPgDateParsers() {
  for (const pgType of typesToReset) {
    setTypeParser(pgType, (val: any) => String(val)); // like noParse() function underhood pg lib
  }
}

resetPgDateParsers();

export const formRouter = express.Router();
const userService = new UserService();
const formService = new FormService();
const auditService = new AuditService();

// Get all forms for a user
formRouter.get("/", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let user = await userService.getByEmail(req.user.email);
    let form = await db("forms").select("*").where("userId", "=", user.id);

    for (let index = 0; index < form.length; index++) {
      form[index].stops = await db("stops").select("*").where("taid", "=", form[index].id);
      let departureDate = await db("stops").min("departureDate").where("taid", "=", form[index].id);
      let departureTime = await db("stops").select("departureTime").where("departureDate", "=", departureDate[0].min);

      form[index].departureDate = departureDate[0].min ? departureDate[0].min : "Unknown";
      form[index].departureTime = departureTime[0] ? departureTime[0].departureTime : "Unknown";
    }
    res.status(200).json(form);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

formRouter.get("/recent", ReturnValidationErrors, async function (req: Request, res: Response) {
  let user = await userService.getByEmail(req.user.email);
  try {
    await db.transaction(async trx => {
      let form = await db("forms").select("*").andWhere("userId", "=", user.id).limit(1).transacting(trx);

      // let stopString = stops.map(stop => {}).concat();

      // let departureDate = await db("stops").min("departureDate").where("taid", "=", form[0].id);
      // departureDate = departureDate[0].min;

      // res.status(200).json({
      //   form: form[0],
      //   expenses: expenses,
      //   stops: stops
      // });
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Error retrieving form");
  }
});

formRouter.get("/upcomingTrips", ReturnValidationErrors, async function (req: Request, res: Response) {
  //let user = await userService.getByEmail(req.user.email);
  let user = await userService.getByEmail("Max.parker@yukon.ca");
  try {
    await db.transaction(async trx => {
      let form = await db("forms").select("*");

      res.status(200).json(await formService.getForm(form[0].id));
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Error retrieving form");
  }
});

//Get one of your own forms
formRouter.get("/:formId", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let user = await userService.getByEmail(req.user.email);
    let form = await formService.getForm(req.params.formId);

    if (form && form.userId === user.id) {
      res.status(200).json(form);
    } else if (form === undefined) {
      res.status(200).json({
        form: "empty"
      });
    } else {
      res.status(404).json("Form not found");
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

//User to save their own form
formRouter.post("/:formId/save", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let user = await userService.getByEmail(req.user.email);
    let form = await formService.getForm(req.params.formId);

    if (!form || (form && form.userId === user.id)) {
      const result = await formService.saveForm(user.id, req.body);
      if (result) {
        auditService.log(user.id, form.id, "Save", "Form saved successfully.");
        res.status(200).json("Form saved");
      } else {
        auditService.log(user.id, form.id, "Save", "Form did not save successfully.");
        res.status(500).json("Form save failed");
      }
    } else {
      auditService.log(user.id, 0, "Save", "Form does not exist or user lacking permissions on form.");
      res.status(404).json("Form not found");
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Insert failed");
  }
});

//User to submit their own form
formRouter.post("/:formId/submit", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    await db.transaction(async trx => {
      let user = await userService.getByEmail(req.user.email);
      let form = await formService.getForm(req.params.formId);

      if (!form || (form && form.userId === user.id)) {
        const result = await formService.submitForm(user.id, req.body);
        if (result) {
          auditService.log(user.id, form.id, "Submit", "Form submitted successfully.");
          res.status(200).json("Form submitted");
        } else {
          auditService.log(user.id, form.id, "Submit", "Form did not submit successfully.");
          res.status(500).json("Form submission failed");
        }
      } else {
        auditService.log(user.id, 0, "Submit", "Form does not exist or user lacking permissions on form.");
        res.status(404).json("Form not found");
      }
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Form submission failed");
  }
});

//Manager to deny travel request
formRouter.post("/:formId/deny", ReturnValidationErrors, async function (req: Request, res: Response) {
  console.log("Saving Form");

  try {
    await db.transaction(async trx => {
      let user = await userService.getByEmail(req.user.email);

      let supervisorEmail = await db("forms").select("email").where("formId", "=", req.params.formId).transacting(trx);

      if (supervisorEmail[0].email.toLowerCase() == user.email.toLowerCase()) {
        let denialReason = req.body.denialReason;

        let id = await db("forms")
          .update({
            denialReason: denialReason,
            status: "Denied"
          })
          .where("formId", "=", req.params.formId)
          .transacting(trx)
          .returning("id");

        auditService.insertAudit(user.id, id[0].id, "Reassign", "Successfully denied form");

        res.status(200).json({
          formId: req.body.formId
        });
      } else {
        res.status(500).json("Not authorized to deny this request");
      }
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Insert failed");
  }
});

//Manager to approve travel request
formRouter.post("/:formId/approve", ReturnValidationErrors, async function (req: Request, res: Response) {
  console.log("Saving Form");

  try {
    await db.transaction(async trx => {
      let user = await userService.getByEmail(req.user.email);

      let supervisorEmail = await db("forms").select("email").where("formId", "=", req.params.formId).transacting(trx);

      if (supervisorEmail[0].email.toLowerCase() == user.email.toLowerCase()) {
        let id = await db("forms")
          .update({
            status: "Approved"
          })
          .where("formId", "=", req.params.formId)
          .transacting(trx)
          .returning("id");

        auditService.insertAudit(user.id, id[0].id, "Reassign", "Successfully approved form");

        res.status(200).json({
          formId: req.body.formId
        });
      } else {
        res.status(401).json("Must be assigned supervisor to approve request");
      }
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Insert failed");
  }
});

//Manager to reassign manager
//Should put the form status back to submitted, awaiting approval
formRouter.post("/:formId/reassign", ReturnValidationErrors, async function (req: Request, res: Response) {
  console.log("Reassigning Form");

  try {
    await db.transaction(async trx => {
      let user = await userService.getByEmail(req.user.email);

      let supervisorEmail = await db("forms").select("email").where("formId", "=", req.params.formId).transacting(trx);

      if (supervisorEmail[0].email.toLowerCase() == user.email.toLowerCase()) {
        let reassign = req.body.reassign;

        let id = await db("forms")
          .update({
            supervisorEmail: reassign
          })
          .where("formId", "=", req.params.formId)
          .transacting(trx)
          .returning("id");

        auditService.insertAudit(user.id, id[0].id, "Reassign", "Successfully reassigned form to " + reassign);
        res.status(200).json({
          formId: req.body.formId
        });
      } else {
        res.status(401).json("Must be supervisor to approve request");
      }
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Insert failed");
  }
});

formRouter.post("/:formId/requestChange", ReturnValidationErrors, async function (req: Request, res: Response) {
  console.log("Request Form Changes");

  try {
    await db.transaction(async trx => {
      let user = await userService.getByEmail(req.user.email);

      let supervisorEmail = await db("forms").select("email").where("formId", "=", req.params.formId).transacting(trx);

      if (supervisorEmail[0].email.toLowerCase() == user.email.toLowerCase()) {
        let id = await db("forms")
          .update({
            requestChange: req.body.requestChange,
            status: "Change Requested"
          })
          .where("formId", "=", req.params.formId)
          .transacting(trx)
          .returning("id");

        auditService.insertAudit(user.id, id[0].id, "Reassign", "Successfully requested changes to form");

        res.status(200).json({
          formId: req.body.formId
        });
      } else {
        res.status(401).json("Must be supervisor to approve request");
      }
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Insert failed");
  }
});

//User to delete their form
//SHould just hide it in db with staus change
formRouter.delete("/:formId", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let user = await userService.getByEmail(req.user.email);

    let id = await db("forms")
      .select("id")
      .where("formId", "=", req.params.formId)
      .andWhere("email", "=", user.email)
      .orWhere("supervisorEmail", "=", user.email);

    if (id) {
      let result = await db("forms")
        .update({
          status: "deleted"
        })
        .where("formId", "=", req.params.formId)
        .returning("formId");

      if (result) {
        res.status(200).json("Delete successful");
        console.log("Delete successful", req.params.id);

        auditService.insertAudit(user.id, id[0].id, "Delete", "Deteled form");
      } else {
        res.status(500).json("Delete failed");
      }
    } else {
      res.status(401).json("Unauthorized");
    }
  } catch (error: any) {
    res.status(500).json("Delete failed");
  }
});

formRouter.get("/:formId/expenses/:type", ReturnValidationErrors, async function (req: Request, res: Response) {
  let user = await userService.getByEmail(req.user.email);
  try {
    await db.transaction(async trx => {
      let form = await db("forms").select("id").where("formId", req.params.formId).transacting(trx);

      let expenses = await db("expenses")
        .select("*")
        .where("type", "=", req.params.type)
        .andWhere("taid", "=", form[0].id)
        .transacting(trx);

      res.status(200).json(expenses);
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Update failed");
  }
});

formRouter.post("/:formId/expenses/:type", ReturnValidationErrors, async function (req: Request, res: Response) {
  let user = await userService.getByEmail(req.user.email);
  try {
    await db.transaction(async trx => {
      let form = await db("forms").select("id", "status").where("formId", req.params.formId).transacting(trx);

      await db("expenses")
        .delete()
        .where("taid", "=", form[0].id)
        .andWhere("type", "=", req.params.type)
        .transacting(trx);

      for (let index = 0; index < req.body.length; index++) {
        let expense = {
          taid: form[0].id,
          ...req.body[index],
          type: req.params.type
        };
        await db("expenses").insert(expense).transacting(trx);
      }
      res.status(200).json("Updated expenses successful");
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Update failed");
  }
});

formRouter.post("/:formId/report/submit", ReturnValidationErrors, async function (req: Request, res: Response) {
  let user = await userService.getByEmail(req.user.email);
  try {
    await db.transaction(async trx => {
      let form = await db("forms").select("id", "status").where("formId", req.params.formId).transacting(trx);

      let reportInsert = {
        ...req.body,
        reportStatus: "Submitted",
        taid: form[0].id
      };

      let id = await db("tripReports").insert(reportInsert, "id").onConflict("taid").merge();

      res.status(200).json("Updated report successful");
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Update failed");
  }
});

formRouter.post("/:formId/report/save", ReturnValidationErrors, async function (req: Request, res: Response) {
  let user = await userService.getByEmail(req.user.email);
  try {
    await db.transaction(async trx => {
      let form = await db("forms").select("id", "status").where("formId", req.params.formId).transacting(trx);

      let reportInsert = {
        ...req.body,
        reportStatus: "Submitted",
        taid: form[0].id
      };

      let id = await db("tripReports").insert(reportInsert, "id").onConflict("taid").merge();

      res.status(200).json("Updated report successful");
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Update failed");
  }
});

formRouter.get("/:formId/report", ReturnValidationErrors, async function (req: Request, res: Response) {
  let user = await userService.getByEmail(req.user.email);
  try {
    let form = await db("forms").select("id").where("formId", req.params.formId);

    let report = {};
    if (form[0]) {
      report = await db("tripReports").select("*").where("taid", "=", form[0].id).first();
    }

    res.status(200).json(report);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Update failed");
  }
});

formRouter.get("/:formId/costDifference", ReturnValidationErrors, async function (req: Request, res: Response) {
  let user = await userService.getByEmail(req.user.email);
  try {
    await db.transaction(async trx => {
      let form = await db("forms").select("id", "status").where("formId", req.params.formId).transacting(trx);

      let result = {};
      if (form[0]) {
        let estimates = await db("expenses")
          .sum("cost")
          .where("taid", "=", form[0].id)
          .andWhere("type", "=", "Estimates");
        let estimatesFloat = (parseFloat(estimates[0].sum) || 0).toFixed(2);

        let expenses = await db("expenses")
          .sum("cost")
          .where("taid", "=", form[0].id)
          .andWhere("type", "=", "Expenses");
        let expensesFloat = (parseFloat(expenses[0].sum) || 0).toFixed(2);

        result = {
          estimates: estimatesFloat,
          expenses: expensesFloat
        };
      }
      res.status(200).json(result);
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Update failed");
  }
});

formRouter.get("/:formId/costDifference", ReturnValidationErrors, async function (req: Request, res: Response) {
  let user = await userService.getByEmail(req.user.email);
  try {
    await db.transaction(async trx => {
      let form = await db("forms").select("id", "status").where("formId", req.params.formId).transacting(trx);

      let result = {};
      if (form[0]) {
        let estimates = await db("expenses")
          .sum("cost")
          .where("taid", "=", form[0].id)
          .andWhere("type", "=", "Estimates");
        let estimatesFloat = (parseFloat(estimates[0].sum) || 0).toFixed(2);

        let expenses = await db("expenses")
          .sum("cost")
          .where("taid", "=", form[0].id)
          .andWhere("type", "=", "Expenses");
        let expensesFloat = (parseFloat(expenses[0].sum) || 0).toFixed(2);

        result = {
          estimates: estimatesFloat,
          expenses: expensesFloat
        };
      }
      res.status(200).json(result);
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Update failed");
  }
});

formRouter.get(
  "/:formId/:expenseId/uploadReceipt",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    try {
      let user = await userService.getByEmail(req.user.email);
      let receiptUpload = await db("expenses")
        .insert("receiptUpload")
        .where("expenses.id", req.params.expenseId)
        .andWhere("forms.taid", req.params.formId);
    } catch (error: any) {
      console.log(error);
      res.status(500).json("Internal Server Error");
    }
  }
);
