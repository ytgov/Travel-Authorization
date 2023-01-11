import express, { Request, Response } from "express";
import { ReturnValidationErrors } from "../middleware";
import { DB_CONFIG } from "../config";
import knex from "knex";
import { UserService, FormService, AuditService } from "../services";
import { v4 as uuid } from "uuid";
import * as formHelper from "../utils/formHelper";
import { auth } from "express-openid-connect";
import { report } from "process";

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

      let expenses = await db("expenses")
        .select("*")
        .where("type", "=", "Expenses")
        .andWhere("taid", "=", form[0].id)
        .transacting(trx);

      let stops = await db("stops")
        .select("*")
        .where("taid", "=", form[0].id)
        .leftJoin("destinations", "stops.travelTo", "destinations.id")
        .orderBy("departureDate", "asc");
      let stopString = stops.map(stop => {}).concat();

      let departureDate = await db("stops").min("departureDate").where("taid", "=", form[0].id);
      departureDate = departureDate[0].min;

      res.status(200).json({
        form: form[0],
        expenses: expenses,
        stops: stops
      });
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

    let form = await db("forms")
      .select("*")
      .where("userId", "=", user.id)
      .andWhere("formId", "=", req.params.formId)
      .first();

    if (form) {
      form.itinerary = await db("stops").select("*").where("taid", "=", form.id);

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
    await db.transaction(async trx => {
      let user = await userService.getByEmail(req.user.email);

      let itinerary = req.body.itinerary;
      delete req.body.itinerary;

      let authInsert = {
        userId: user.id,
        ...req.body,
        formStatus: "Draft",
        formId: req.params.formId
      };

      let form = await db("forms").select("*").andWhere("formId", "=", req.params.formId).first();

      if (!form || form.userId === user.id) {
        let id = await db("forms").insert(authInsert, "id").onConflict("formId").merge();

        await db("stops").delete().where("taid", "=", id[0].id).transacting(trx);

        for (let index = 0; index < itinerary.length; index++) {
          itinerary[index].travelTo = itinerary[index].locationId;
          let stop = {
            taid: id[0].id,
            ...itinerary[index]
          };
          await db("stops").insert(stop).transacting(trx);
        }
        auditService.insertAudit(user.id, id[0].id, "Save", "Successfully saved form");
        res.status(200).json({
          formId: req.params.formId
        });
      } else {
        res.status(401).json("Unauthorized");
      }
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Insert failed");
  }
});

//User to submit their own form
formRouter.post("/:formId/submit", ReturnValidationErrors, async function (req: Request, res: Response) {
  console.log("Saving Form");

  try {
    await db.transaction(async trx => {
      let user = await userService.getByEmail(req.user.email);

      let stops = req.body.stops;
      delete req.body.stops;

      let authInsert = {
        userId: user.id,
        ...req.body,
        formStatus: "Submitted",
        formId: req.params.formId
      };

      if (
        authInsert.userId &&
        authInsert.firstName &&
        authInsert.lastName &&
        authInsert.department &&
        authInsert.division &&
        authInsert.branch &&
        authInsert.unit &&
        authInsert.email &&
        authInsert.mailcode &&
        authInsert.travelDuration &&
        authInsert.dateBackToWork &&
        authInsert.purpose &&
        authInsert.eventName &&
        authInsert.summary &&
        authInsert.supervisorEmail &&
        authInsert.formStatus &&
        authInsert.formId
      ) {
        let id = await db("forms").insert(authInsert, "id").onConflict("formId").merge();

        await db("stops").delete().where("taid", "=", id[0].id).transacting(trx);

        for (let index = 0; index < stops.length; index++) {
          stops[index].travelTo = stops[index].travelTo.value;
          stops[index].travelFrom = stops[index].travelFrom.value;
          let stop = {
            taid: id[0].id,
            ...stops[index],
            estimate: 0
          };
          await db("stops").insert(stop).transacting(trx);
        }
        auditService.insertAudit(user.id, id[0].id, "Submit", "Successfully submitted form");

        res.status(200).json({
          formId: req.params.formId
        });
      } else {
        res.status(500).json("Required fields in submission are blank");
      }
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Insert failed");
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
            formStatus: "Denied"
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
            formStatus: "Approved"
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
            formStatus: "Change Requested"
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
          formstatus: "deleted"
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
      let form = await db("forms").select("id", "formStatus").where("formId", req.params.formId).transacting(trx);

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
      let form = await db("forms").select("id", "formStatus").where("formId", req.params.formId).transacting(trx);

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
      let form = await db("forms").select("id", "formStatus").where("formId", req.params.formId).transacting(trx);

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
      let form = await db("forms").select("id", "formStatus").where("formId", req.params.formId).transacting(trx);

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
      let form = await db("forms").select("id", "formStatus").where("formId", req.params.formId).transacting(trx);

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
