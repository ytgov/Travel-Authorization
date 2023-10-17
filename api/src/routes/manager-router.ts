import { isNull } from "lodash"
import express, { Request, Response } from "express"

import { ReturnValidationErrors } from "@/middleware"
import { UserService } from "@/services"
import { TravelAuthorization } from "@/models"

import dbLegacy from "@/db/db-client-legacy"

export const managerRouter = express.Router()
const userService = new UserService()

managerRouter.get(
  "/forms/:formId",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    try {
      const user = await userService.getByEmail(req.user.email)
      const form = await TravelAuthorization.findOne({
        where: { slug: req.params.formId, supervisorEmail: user.email },
      })

      if (isNull(form)) {
        return res.status(404).json("Form not found")
      }

      form.stops = await dbLegacy("stops").select("*").where("taid", "=", form.id)

      res.status(200).json(form)
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Internal Server Error")
    }
  }
)

managerRouter.get("/forms", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let user = await userService.getByEmail(req.user.email)
    const forms = await TravelAuthorization.findAll({
      where: { supervisorEmail: user.email },
    })

    for (let index = 0; index < forms.length; index++) {
      forms[index].stops = await dbLegacy("stops").select("*").where("taid", "=", forms[index].id)
      let departureDate = await dbLegacy("stops").min("departureDate").where("taid", "=", forms[index].id)
      // @ts-ignore - isn't worth fixing at this time
      forms[index].departureDate = departureDate[0].min
    }
    res.status(200).json(forms)
  } catch (error: any) {
    console.log(error)
    res.status(500).json("Internal Server Error")
  }
})
