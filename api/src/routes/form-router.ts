import { isNull } from "lodash"
import express, { Request, Response } from "express"

import { ReturnValidationErrors } from "../middleware"

import { UserService, FormService, AuditService } from "@/services"
import { Expense, Form } from "@/models"

import dbLegacy from "@/db/db-client-legacy"
import db from "@/db/db-client"

// TODO: Check if parser/builtins hack patch code is still needed
const { setTypeParser, builtins } = require("pg").types

const typesToReset = [
  builtins.DATE,
  builtins.TIME,
  builtins.TIMETZ,
  builtins.TIMESTAMP,
  builtins.TIMESTAMPTZ,
]

function resetPgDateParsers() {
  for (const pgType of typesToReset) {
    setTypeParser(pgType, (val: any) => String(val)) // like noParse() function underhood pg lib
  }
}

resetPgDateParsers()

export const formRouter = express.Router()
const userService = new UserService()
const formService = new FormService()
const auditService = new AuditService()

// Get all forms for a user
formRouter.get("/", ReturnValidationErrors, async function (req: Request, res: Response) {
  console.warn("DEPRECATED: prefer /api/forms instead")
  try {
    let user = await userService.getByEmail(req.user.email)
    const forms = await Form.findAll({ where: { userId: user.id } })

    for (let index = 0; index < forms.length; index++) {
      forms[index].stops = await dbLegacy("stops").select("*").where("taid", "=", forms[index].id)
      let departureDate = await dbLegacy("stops")
        .min("departureDate")
        .where("taid", "=", forms[index].id)
      let departureTime = await dbLegacy("stops")
        .select("departureTime")
        .where("departureDate", "=", departureDate[0].min)

      // @ts-ignore - this code is deprecated so not worth fixing the type issues
      forms[index].departureDate = departureDate[0].min ? departureDate[0].min : "Unknown"
      // @ts-ignore - this code is deprecated so not worth fixing the type issues
      forms[index].departureTime = departureTime[0] ? departureTime[0].departureTime : "Unknown"
    }
    res.status(200).json(forms)
  } catch (error: any) {
    console.log(error)
    res.status(500).json("Internal Server Error")
  }
})

formRouter.get(
  "/upcomingTrips",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    //let user = await userService.getByEmail(req.user.email);
    let user = await userService.getByEmail("Max.parker@yukon.ca")
    try {
      const form = await Form.findOne()
      if (isNull(form)) {
        return res.status(404).json({ message: "No upcoming trips found" })
      }

      res.status(200).json(await formService.getForm(form.id.toString()))
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Error retrieving form")
    }
  }
)

//Get one of your own forms
formRouter.get("/:formId", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let user = await userService.getByEmail(req.user.email)
    let form = await formService.getForm(req.params.formId)

    if (form && form.userId === user.id) {
      res.status(200).json(form)
    } else if (form === undefined) {
      res.status(200).json({
        form: "empty",
      })
    } else {
      res.status(404).json("Form not found")
    }
  } catch (error: any) {
    console.log(error)
    res.status(500).json("Internal Server Error")
  }
})

//User to save their own form
formRouter.post(
  "/:formId/save",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    try {
      let user = await userService.getByEmail(req.user.email)
      let form = await formService.getForm(req.params.formId)

      if (!form || (form && form.userId === user.id)) {
        const result = await formService.saveForm(user.id, req.body)
        if (result) {
          auditService.log(user.id, form.id, "Save", "Form saved successfully.")
          res.status(200).json("Form saved")
        } else {
          auditService.log(user.id, form.id, "Save", "Form did not save successfully.")
          res.status(500).json("Form save failed")
        }
      } else {
        auditService.log(
          user.id,
          0,
          "Save",
          "Form does not exist or user lacking permissions on form."
        )
        res.status(404).json("Form not found")
      }
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Insert failed")
    }
  }
)

//User to submit their own form
formRouter.post(
  "/:formId/submit",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    console.warn(
      "This method is deprecated, and will be removed in a future version. Please use POST /api/forms instead."
    )
    try {
      await dbLegacy.transaction(async (trx) => {
        let user = await userService.getByEmail(req.user.email)
        let form = await formService.getForm(req.params.formId)

        if (!form || (form && form.userId === user.id)) {
          const result = await formService.submitForm(user.id, req.body)
          if (result) {
            auditService.log(user.id, form.id, "Submit", "Form submitted successfully.")
            res.status(200).json("Form submitted")
          } else {
            auditService.log(user.id, form?.id, "Submit", "Form did not submit successfully.")
            res.status(422).json("Form submission failed")
          }
        } else {
          auditService.log(
            user.id,
            0,
            "Submit",
            "Form does not exist or user lacking permissions on form."
          )
          res.status(404).json("Form not found")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Form submission failed")
    }
  }
)

//Manager to deny travel request
formRouter.post(
  "/:formId/deny",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    console.log("Saving Form")

    try {
      await dbLegacy.transaction(async (trx) => {
        let user = await userService.getByEmail(req.user.email)

        const form = await Form.findOne({ where: { formId: req.params.formId } })
        if (isNull(form)) {
          return res.status(404).json({ message: "Form not found" })
        }

        const supervisorEmail = form.email
        if (supervisorEmail?.toLowerCase() === user.email.toLowerCase()) {
          let denialReason = req.body.denialReason

          await form.update({
            denialReason: denialReason,
            status: Form.Statuses.DENIED,
          })

          auditService.insertAudit(user.id, form.id, "Reassign", "Successfully denied form")

          res.status(200).json({
            formId: req.body.formId,
          })
        } else {
          res.status(500).json("Not authorized to deny this request")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Insert failed")
    }
  }
)

//Manager to approve travel request
formRouter.post(
  "/:formId/approve",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    console.log("Saving Form")

    try {
      await dbLegacy.transaction(async (trx) => {
        let user = await userService.getByEmail(req.user.email)

        const form = await Form.findOne({ where: { formId: req.params.formId } })
        if (isNull(form)) {
          return res.status(404).json({ message: "Form not found" })
        }

        const supervisorEmail = form.email

        if (supervisorEmail?.toLowerCase() == user.email.toLowerCase()) {
          await form.update({
            status: Form.Statuses.APPROVED,
          })

          auditService.insertAudit(user.id, form.id, "Reassign", "Successfully approved form")

          res.status(200).json({
            formId: req.body.formId,
          })
        } else {
          res.status(403).json("Must be assigned supervisor to approve request")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Insert failed")
    }
  }
)

//Manager to reassign manager
//Should put the form status back to submitted, awaiting approval
formRouter.post(
  "/:formId/reassign",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    console.log("Reassigning Form")

    try {
      await dbLegacy.transaction(async (trx) => {
        let user = await userService.getByEmail(req.user.email)

        const form = await Form.findOne({ where: { formId: req.params.formId } })
        if (isNull(form)) {
          return res.status(404).json({ message: "Form not found" })
        }

        const supervisorEmail = form.email

        if (supervisorEmail?.toLowerCase() == user.email.toLowerCase()) {
          let reassign = req.body.reassign

          await form.update({
            supervisorEmail: reassign,
          })

          auditService.insertAudit(
            user.id,
            form.id,
            "Reassign",
            "Successfully reassigned form to " + reassign
          )
          res.status(200).json({
            formId: req.body.formId,
          })
        } else {
          res.status(403).json("Must be supervisor to approve request")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Insert failed")
    }
  }
)

formRouter.post(
  "/:formId/requestChange",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    console.log("Request Form Changes")

    try {
      await dbLegacy.transaction(async (trx) => {
        let user = await userService.getByEmail(req.user.email)

        const form = await Form.findOne({ where: { formId: req.params.formId } })
        if (isNull(form)) {
          return res.status(404).json({ message: "Form not found" })
        }

        const supervisorEmail = form.email

        if (supervisorEmail?.toLowerCase() == user.email.toLowerCase()) {
          await form.update({
            requestChange: req.body.requestChange,
            status: Form.Statuses.CHANGE_REQUESTED,
          })

          auditService.insertAudit(
            user.id,
            form.id,
            "Reassign",
            "Successfully requested changes to form"
          )

          res.status(200).json({
            formId: req.body.formId,
          })
        } else {
          res.status(403).json("Must be supervisor to approve request")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Insert failed")
    }
  }
)

//User to delete their form
//SHould just hide it in db with staus change
formRouter.delete("/:formId", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let user = await userService.getByEmail(req.user.email)

    let id = await dbLegacy("forms")
      .select("id")
      .where("formId", "=", req.params.formId)
      .andWhere("email", "=", user.email)
      .orWhere("supervisorEmail", "=", user.email)

    if (id) {
      let result = await dbLegacy("forms")
        .update({
          status: "deleted",
        })
        .where("formId", "=", req.params.formId)
        .returning("formId")

      if (result) {
        res.status(200).json("Delete successful")
        console.log("Delete successful", req.params.id)

        auditService.insertAudit(user.id, id[0].id, "Delete", "Deteled form")
      } else {
        res.status(500).json("Delete failed")
      }
    } else {
      res.status(401).json("Unauthorized")
    }
  } catch (error: any) {
    res.status(500).json("Delete failed")
  }
})

// TODO: deprecate this in favor of the /api/expenses
formRouter.get(
  "/:formId/expenses/:type",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    let user = await userService.getByEmail(req.user.email)
    try {
      await dbLegacy.transaction(async (trx) => {
        let form = await dbLegacy("forms")
          .select("id")
          .where("formId", req.params.formId)
          .transacting(trx)

        const expenses = Expense.findAll({
          where: {
            formId: form[0].id,
            type: req.params.type,
          },
        })

        res.status(200).json(expenses)
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Update failed")
    }
  }
)

// TODO: deprecate this in favor of the /api/expenses
formRouter.post(
  "/:formId/expenses/:type",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    let user = await userService.getByEmail(req.user.email)
    try {
      await dbLegacy.transaction(async (trx) => {
        let form = await dbLegacy("forms")
          .select("id", "status")
          .where("formId", req.params.formId)
          .transacting(trx)

        db.transaction(async () => {
          await Expense.destroy({
            where: {
              formId: form[0].id,
              type: req.params.type,
            },
          })
          for (let index = 0; index < req.body.length; index++) {
            const expense = {
              formId: form[0].id,
              ...req.body[index],
              type: req.params.type,
            }
            await Expense.create(expense)
          }
        })

        res.status(200).json("Updated expenses successful")
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Update failed")
    }
  }
)

formRouter.post(
  "/:formId/report/submit",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    let user = await userService.getByEmail(req.user.email)
    try {
      await dbLegacy.transaction(async (trx) => {
        let form = await dbLegacy("forms")
          .select("id", "status")
          .where("formId", req.params.formId)
          .transacting(trx)

        let reportInsert = {
          ...req.body,
          reportStatus: "Submitted",
          taid: form[0].id,
        }

        let id = await dbLegacy("tripReports").insert(reportInsert, "id").onConflict("taid").merge()

        res.status(200).json("Updated report successful")
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Update failed")
    }
  }
)

formRouter.post(
  "/:formId/report/save",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    let user = await userService.getByEmail(req.user.email)
    try {
      await dbLegacy.transaction(async (trx) => {
        let form = await dbLegacy("forms")
          .select("id", "status")
          .where("formId", req.params.formId)
          .transacting(trx)

        let reportInsert = {
          ...req.body,
          reportStatus: "Submitted",
          taid: form[0].id,
        }

        let id = await dbLegacy("tripReports").insert(reportInsert, "id").onConflict("taid").merge()

        res.status(200).json("Updated report successful")
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Update failed")
    }
  }
)

formRouter.get(
  "/:formId/report",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    let user = await userService.getByEmail(req.user.email)
    try {
      let form = await dbLegacy("forms").select("id").where("formId", req.params.formId)

      let report = {}
      if (form[0]) {
        report = await dbLegacy("tripReports").select("*").where("taid", "=", form[0].id).first()
      }

      res.status(200).json(report)
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Update failed")
    }
  }
)

// TODO: rewrite as RESTful endpoint
formRouter.get(
  "/:formId/costDifference",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    try {
      await dbLegacy.transaction(async (trx) => {
        let form = await dbLegacy("forms")
          .select("id", "status")
          .where("formId", req.params.formId)
          .transacting(trx)

        let result = {}
        if (form[0]) {
          const estimatesFloat = await Expense.sum("cost", {
            where: {
              formId: form[0].id,
              type: Expense.Types.ESTIMATE,
            },
          }).then((result) => result.toFixed(2))

          const expensesFloat = await Expense.sum("cost", {
            where: {
              formId: form[0].id,
              type: Expense.Types.EXPENSE,
            },
          }).then((result) => result.toFixed(2))

          result = {
            estimates: estimatesFloat,
            expenses: expensesFloat,
          }
        }
        res.status(200).json(result)
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Lookup failed")
    }
  }
)
