import { isNull, minBy } from "lodash"
import express, { Request, Response } from "express"

import { ReturnValidationErrors } from "@/middleware"
import { TravelAuthorization, User } from "@/models"

export const managerRouter = express.Router()

managerRouter.get(
  "/forms/:formId",
  ReturnValidationErrors,
  async function (req: Request, res: Response) {
    try {
      const user = await User.findOne({ where: { email: req.user.email } })
      if (isNull(user)) {
        return res.status(404).json({ message: "User not found" })
      }

      const form = await TravelAuthorization.findOne({
        where: { slug: req.params.formId, supervisorEmail: user.email },
        include: ["stops"],
      })

      if (isNull(form)) {
        return res.status(404).json("Form not found")
      }

      res.status(200).json(form)
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Internal Server Error")
    }
  }
)

managerRouter.get("/forms", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    const user = await User.findOne({ where: { email: req.user.email } })
    if (isNull(user)) {
      return res.status(404).json({ message: "User not found" })
    }

    const forms = await TravelAuthorization.findAll({
      where: { supervisorEmail: user.email },
      include: ["stops"],
    })

    forms.forEach((form) => {
      const stops = form.stops
      const earliestStop = minBy(stops, "departureDate")

      // @ts-ignore - isn't worth fixing at this time
      form.departureDate = earliestStop?.departureDate
    })

    res.status(200).json(forms)
  } catch (error: any) {
    console.log(error)
    res.status(500).json("Internal Server Error")
  }
})
