import { minBy } from "lodash"
import express, { Request, Response } from "express"
import knex from "knex"
import { WhereOptions } from "sequelize"

import {
  RequiresAuth,
  RequiresRoleAdmin,
  RequiresRoleTdUser,
  RequiresRoleTdUserOrAdmin,
} from "@/middleware"
import { DB_CONFIG } from "@/config"
import { UserService } from "@/services"
import { TravelAuthorization } from "@/models"

const db = knex(DB_CONFIG)

export const travelDeskRouter = express.Router()
const userService = new UserService()

travelDeskRouter.get("/", RequiresAuth, async function (req: Request, res: Response) {
  const travelRequests = await db("travelDeskTravelRequest").select("*").whereNot({
    status: "draft",
  })

  for (const travelRequest of travelRequests) {
    const requestID = travelRequest.requestID
    const TAID = travelRequest.TAID

    const form = await TravelAuthorization.findOne({
      where: { id: TAID },
      include: ["stops"],
    })
    travelRequest.form = form

    const flightRequests = await db("travelDeskFlightRequest")
      .select("*")
      .where("requestID", requestID)
    travelRequest.flightRequests = flightRequests

    const rentalCars = await db("travelDeskRentalCar").select("*").where("requestID", requestID)
    travelRequest.rentalCars = rentalCars

    const hotels = await db("travelDeskHotel").select("*").where("requestID", requestID)
    travelRequest.hotels = hotels

    const otherTransportations = await db("travelDeskOtherTransportation")
      .select("*")
      .where("requestID", requestID)
    travelRequest.otherTransportation = otherTransportations

    const questions = await db("travelDeskQuestion").select("*").where("requestID", requestID)
    for (const question of questions) {
      question.state = { questionErr: false, responseErr: false }
    }
    travelRequest.questions = questions

    const invoiceNumber = await db("travelDeskPnrDocuments")
      .select("invoiceNumber")
      .where("requestID", requestID)
      .first()
    travelRequest.invoiceNumber = invoiceNumber?.invoiceNumber ? invoiceNumber.invoiceNumber : ""
  }

  res.status(200).json(travelRequests)
})

travelDeskRouter.get(
  "/authorized-travels/",
  RequiresAuth,
  async function (req: Request, res: Response) {
    const adminScoping: WhereOptions<TravelAuthorization> = {}
    if (req?.user?.roles?.includes("Admin")) {
      // No additional conditions for Admin, selects all records
    } else if (req?.user?.roles?.includes("DeptAdmin")) {
      adminScoping.department = req.user.department
    } else {
      adminScoping.userId = req.user.id
    }

    try {
      const forms = await TravelAuthorization.findAll({
        where: adminScoping,
        include: ["stops"],
      })

      for (const form of forms) {
        const stops = form.stops
        const earliestStop = minBy(stops, (stop) => {
          return `${stop.departureDate} ${stop.departureTime}`
        })
        // @ts-ignore - this code is deprecated so not worth fixing the type issues
        form.departureDate = earliestStop?.departureDate || "Unknown"
        // @ts-ignore - this code is deprecated so not worth fixing the type issues
        form.departureTime = earliestStop?.departureTime || "Unknown"

        // @ts-ignore - isn't worth fixing at this time
        form.travelRequest = await db("travelDeskTravelRequest")
          .select("*")
          .where("TAID", form.id)
          .first()

        // @ts-ignore - isn't worth fixing at this time
        const requestID = form.travelRequest?.requestID
        if (requestID) {
          const invoiceNumber = await db("travelDeskPnrDocuments")
            .select("invoiceNumber")
            .where("requestID", requestID)
            .first()
          // @ts-ignore - isn't worth fixing at this time
          form.travelRequest.invoiceNumber = invoiceNumber?.invoiceNumber
            ? invoiceNumber.invoiceNumber
            : ""
        }
      }
      res.status(200).json(forms)
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Internal Server Error")
    }
  }
)

travelDeskRouter.get(
  "/flight-options/:flightRequestId",
  RequiresAuth,
  async function (req: Request, res: Response) {
    const flightSegmentState = {
      flightErr: false,
      departDateErr: false,
      departTimeErr: false,
      departLocationErr: false,
      arriveDateErr: false,
      arriveTimeErr: false,
      arriveLocationErr: false,
      durationErr: false,
      classErr: false,
      statusErr: false,
    }

    const flightRequestID = Number(req.params.flightRequestId)
    let tmpId = 2000

    const flightOptions = await db("travelDeskFlightOption")
      .select("*")
      .where("flightRequestID", flightRequestID)
    for (const flightOption of flightOptions) {
      const flightSegments = await db("travelDeskFlightSegment")
        .select("*")
        .where("flightOptionID", flightOption.flightOptionID)
      for (const flightSegment of flightSegments) {
        flightSegment.state = flightSegmentState
        flightSegment.tmpId = tmpId
        flightSegment.departDay = flightSegment.departDate.substring(0, 10)
        flightSegment.departTime = flightSegment.departDate.substring(11, 16)
        flightSegment.arriveDay = flightSegment.arriveDate.substring(0, 10)
        flightSegment.arriveTime = flightSegment.arriveDate.substring(11, 16)
        tmpId++
      }
      flightOption.flightSegments = flightSegments
      flightOption.state = { costErr: false, legErr: false }
    }

    res.status(200).json(flightOptions)
  }
)

travelDeskRouter.post(
  "/flight-options/:requestID",
  RequiresAuth,
  async function (req: Request, res: Response) {
    try {
      await db.transaction(async (trx) => {
        const requestID = Number(req.params.requestID)
        const newFlightOptions = req.body
        //console.log(newFlightOptions)
        if (newFlightOptions.length < 1 || !requestID)
          return res.status(500).json("Empty Payload for Flight Options")

        const flightRequestQuery = await await db("travelDeskFlightRequest")
          .select("flightRequestID")
          .where("requestID", requestID)
        const flightRequestIDs = flightRequestQuery.map((req) => req.flightRequestID)
        // console.log(flightRequestIDs)
        await db("travelDeskFlightOption").delete().whereIn("flightRequestID", flightRequestIDs)

        for (const newFlightOption of newFlightOptions) {
          delete newFlightOption.state

          const flightSegments = newFlightOption.flightSegments
          delete newFlightOption.flightSegments

          const id = await db("travelDeskFlightOption").insert(newFlightOption, "flightOptionID")

          for (const flightSegment of flightSegments) {
            // console.log(flightSegment)
            delete flightSegment.tmpId
            delete flightSegment.state
            delete flightSegment.departDay
            delete flightSegment.departTime
            delete flightSegment.arriveDay
            delete flightSegment.arriveTime
            flightSegment.flightOptionID = id[0].flightOptionID
            await db("travelDeskFlightSegment").insert(flightSegment)
          }
        }
        res.status(200).json("Successful")
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Saving the Flight Options failed")
    }
  }
)

travelDeskRouter.delete(
  "/flight-options/:requestID",
  RequiresAuth,
  RequiresRoleTdUser,
  async function (req: Request, res: Response) {
    try {
      const requestID = Number(req.params.requestID)
      // console.log(flightRequestIDs)
      await db.transaction(async (trx) => {
        const flightRequestQuery = await await db("travelDeskFlightRequest")
          .select("flightRequestID")
          .where("requestID", requestID)
        const flightRequestIDs = flightRequestQuery.map((req) => req.flightRequestID)

        await db("travelDeskFlightOption")
          .delete()
          .whereIn("flightRequestID", flightRequestIDs)
          .transacting(trx)
        res.status(200).json("Delete Successful")
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Delete failed")
    }
  }
)

travelDeskRouter.get(
  "/flight-request/:requestID",
  RequiresAuth,
  async function (req: Request, res: Response) {
    const flightSegmentState = {
      flightErr: false,
      departDateErr: false,
      departTimeErr: false,
      departLocationErr: false,
      arriveDateErr: false,
      arriveTimeErr: false,
      arriveLocationErr: false,
      durationErr: false,
      classErr: false,
      statusErr: false,
    }

    const requestID = Number(req.params.requestID)

    if (requestID) {
      let tmpId = 3000

      const flightRequests = await db("travelDeskFlightRequest")
        .select("*")
        .where("requestID", requestID)
      for (const flightRequest of flightRequests) {
        const flightOptions = await db("travelDeskFlightOption")
          .select("*")
          .where("flightRequestID", flightRequest.flightRequestID)
        for (const flightOption of flightOptions) {
          const flightSegments = await db("travelDeskFlightSegment")
            .select("*")
            .where("flightOptionID", flightOption.flightOptionID)
          for (const flightSegment of flightSegments) {
            flightSegment.state = flightSegmentState
            flightSegment.tmpId = tmpId
            flightSegment.departDay = flightSegment.departDate.substring(0, 10)
            flightSegment.departTime = flightSegment.departDate.substring(11, 16)
            flightSegment.arriveDay = flightSegment.arriveDate.substring(0, 10)
            flightSegment.arriveTime = flightSegment.arriveDate.substring(11, 16)
            tmpId++
          }
          flightOption.flightSegments = flightSegments
          flightOption.state = { costErr: false, legErr: false }
        }
        flightRequest.flightOptions = flightOptions
      }
      res.status(200).json(flightRequests)
    } else res.status(500).json("Missing all parameters!")
  }
)

travelDeskRouter.post(
  "/flight-request/:requestID",
  RequiresAuth,
  async function (req: Request, res: Response) {
    try {
      await db.transaction(async (trx) => {
        const requestID = Number(req.params.requestID)
        const flightRequests = req.body
        // console.log(flightRequests)

        if (requestID) {
          await db("travelDeskFlightRequest").delete().where("requestID", requestID)

          for (const flightRequest of flightRequests) {
            const newFlightOptions = flightRequest.flightOptions
            delete flightRequest.flightOptions
            delete flightRequest.tmpId
            if (flightRequest.flightRequestID == null) delete flightRequest.flightRequestID

            flightRequest.requestID = requestID

            const flightId = await db("travelDeskFlightRequest").insert(
              flightRequest,
              "flightRequestID"
            )
            const flightRequestID = flightId[0].flightRequestID

            await db("travelDeskFlightOption").delete().where("flightRequestID", flightRequestID)

            for (const newFlightOption of newFlightOptions) {
              delete newFlightOption.state

              const flightSegments = newFlightOption.flightSegments
              delete newFlightOption.flightSegments

              newFlightOption.flightRequestID = flightRequestID

              const id = await db("travelDeskFlightOption").insert(
                newFlightOption,
                "flightOptionID"
              )

              for (const flightSegment of flightSegments) {
                // console.log(flightSegment)
                delete flightSegment.tmpId
                delete flightSegment.state
                delete flightSegment.departDay
                delete flightSegment.departTime
                delete flightSegment.arriveDay
                delete flightSegment.arriveTime
                flightSegment.flightOptionID = id[0].flightOptionID
                await db("travelDeskFlightSegment").insert(flightSegment)
              }
            }
          }
          res.status(200).json("Successful")
        } else {
          res.status(500).json("Required fields in submission are blank")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Saving the Flight Request failed")
    }
  }
)

travelDeskRouter.get(
  "/travel-request/:taid",
  RequiresAuth,
  async function (req: Request, res: Response) {
    const flightSegmentState = {
      flightErr: false,
      departDateErr: false,
      departTimeErr: false,
      departLocationErr: false,
      arriveDateErr: false,
      arriveTimeErr: false,
      arriveLocationErr: false,
      durationErr: false,
      classErr: false,
      statusErr: false,
    }

    const travelRequest = await db("travelDeskTravelRequest")
      .select("*")
      .where({
        TAID: req.params.taid,
      })
      .first()

    if (travelRequest) {
      const requestID = travelRequest.requestID

      let tmpId = 1000

      const flightRequests = await db("travelDeskFlightRequest")
        .select("*")
        .where("requestID", requestID)
      for (const flightRequest of flightRequests) {
        const flightOptions = await db("travelDeskFlightOption")
          .select("*")
          .where("flightRequestID", flightRequest.flightRequestID)
        for (const flightOption of flightOptions) {
          const flightSegments = await db("travelDeskFlightSegment")
            .select("*")
            .where("flightOptionID", flightOption.flightOptionID)
          for (const flightSegment of flightSegments) {
            flightSegment.state = flightSegmentState
            flightSegment.tmpId = tmpId
            flightSegment.departDay = flightSegment.departDate.substring(0, 10)
            flightSegment.departTime = flightSegment.departDate.substring(11, 16)
            flightSegment.arriveDay = flightSegment.arriveDate.substring(0, 10)
            flightSegment.arriveTime = flightSegment.arriveDate.substring(11, 16)
            tmpId++
          }
          flightOption.flightSegments = flightSegments
          flightOption.state = { costErr: false, legErr: false }
        }
        flightRequest.flightOptions = flightOptions
      }
      travelRequest.flightRequests = flightRequests

      const rentalCars = await db("travelDeskRentalCar").select("*").where("requestID", requestID)
      travelRequest.rentalCars = rentalCars

      const hotels = await db("travelDeskHotel").select("*").where("requestID", requestID)
      travelRequest.hotels = hotels

      const otherTransportation = await db("travelDeskOtherTransportation")
        .select("*")
        .where("requestID", requestID)
      travelRequest.otherTransportation = otherTransportation

      const questions = await db("travelDeskQuestion").select("*").where("requestID", requestID)
      for (const question of questions) {
        question.state = { questionErr: false, responseErr: false }
      }
      travelRequest.questions = questions

      const invoiceNumber = await db("travelDeskPnrDocuments")
        .select("invoiceNumber")
        .where("requestID", requestID)
        .first()
      travelRequest.invoiceNumber = invoiceNumber?.invoiceNumber ? invoiceNumber.invoiceNumber : ""
    }

    res.status(200).json(travelRequest)
  }
)

travelDeskRouter.post(
  "/travel-request/:taid",
  RequiresAuth,
  async function (req: Request, res: Response) {
    try {
      await db.transaction(async (trx) => {
        const TAID = Number(req.params.taid)
        const newTravelRequest = req.body
        // console.log(newTravelRequest)

        if (TAID) {
          delete newTravelRequest.invoiceNumber

          const flightRequests = newTravelRequest.flightRequests
          delete newTravelRequest.flightRequests

          const rentalCars = newTravelRequest.rentalCars
          delete newTravelRequest.rentalCars

          const hotels = newTravelRequest.hotels
          delete newTravelRequest.hotels

          const otherTransportations = newTravelRequest.otherTransportation
          delete newTravelRequest.otherTransportation

          const questions = newTravelRequest.questions
          delete newTravelRequest.questions

          let id = null
          const travelRequestQuery = await db("travelDeskTravelRequest")
            .select("*")
            .where("TAID", TAID)

          if (travelRequestQuery.length == 1) {
            id = await db("travelDeskTravelRequest")
              .update(newTravelRequest, "requestID")
              .where("TAID", TAID)
          } else if (travelRequestQuery.length == 0) {
            id = await db("travelDeskTravelRequest").insert(newTravelRequest, "requestID")
          } else {
            return res.status(500).json("Multiple Travel Request Records!")
          }

          //FlightRequests
          await db("travelDeskFlightRequest").delete().where("requestID", id[0].requestID)

          for (const flightRequest of flightRequests) {
            const newFlightOptions = flightRequest.flightOptions
            delete flightRequest.flightOptions
            delete flightRequest.tmpId
            if (flightRequest.flightRequestID == null) delete flightRequest.flightRequestID

            flightRequest.requestID = id[0].requestID

            const flightId = await db("travelDeskFlightRequest").insert(
              flightRequest,
              "flightRequestID"
            )
            const flightRequestID = flightId[0].flightRequestID

            await db("travelDeskFlightOption").delete().where("flightRequestID", flightRequestID)

            for (const newFlightOption of newFlightOptions) {
              delete newFlightOption.state

              const flightSegments = newFlightOption.flightSegments
              delete newFlightOption.flightSegments

              newFlightOption.flightRequestID = flightRequestID

              const id = await db("travelDeskFlightOption").insert(
                newFlightOption,
                "flightOptionID"
              )

              for (const flightSegment of flightSegments) {
                // console.log(flightSegment)
                delete flightSegment.tmpId
                delete flightSegment.state
                delete flightSegment.departDay
                delete flightSegment.departTime
                delete flightSegment.arriveDay
                delete flightSegment.arriveTime
                flightSegment.flightOptionID = id[0].flightOptionID
                await db("travelDeskFlightSegment").insert(flightSegment)
              }
            }
          }

          //RentalCars
          await db("travelDeskRentalCar").delete().where("requestID", id[0].requestID)

          for (const rentalCar of rentalCars) {
            delete rentalCar.tmpId
            if (rentalCar.rentalVehicleID == null) delete rentalCar.rentalVehicleID
            rentalCar.requestID = id[0].requestID
            await db("travelDeskRentalCar").insert(rentalCar)
          }

          //Hotels
          await db("travelDeskHotel").delete().where("requestID", id[0].requestID)

          for (const hotel of hotels) {
            delete hotel.tmpId
            if (hotel.hotelID == null) delete hotel.hotelID
            hotel.requestID = id[0].requestID
            await db("travelDeskHotel").insert(hotel)
          }

          //Other Transportations
          await db("travelDeskOtherTransportation").delete().where("requestID", id[0].requestID)

          for (const otherTransportation of otherTransportations) {
            delete otherTransportation.tmpId
            if (otherTransportation.transportationID == null)
              delete otherTransportation.transportationID
            otherTransportation.requestID = id[0].requestID
            await db("travelDeskOtherTransportation").insert(otherTransportation)
          }

          //Questions
          await db("travelDeskQuestion").delete().where("requestID", id[0].requestID)

          for (const question of questions) {
            delete question.tmpId
            delete question.state
            if (question.questionID == null) delete question.questionID
            question.requestID = id[0].requestID
            await db("travelDeskQuestion").insert(question)
          }

          res.status(200).json("Successful")
        } else {
          res.status(500).json("Required fields in submission are blank")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Saving the Travel Request failed")
    }
  }
)

travelDeskRouter.get(
  "/travel-agents/",
  RequiresAuth,
  RequiresRoleTdUserOrAdmin,
  async function (req: Request, res: Response) {
    const travelAgents = await db("travelDeskTravelAgent").select("*")
    res.status(200).json(travelAgents)
  }
)

travelDeskRouter.delete(
  "/travel-agents/:agencyID",
  RequiresAuth,
  RequiresRoleAdmin,
  async function (req: Request, res: Response) {
    try {
      const agencyID = Number(req.params.agencyID)

      await db.transaction(async (trx) => {
        await db("travelDeskTravelAgent").delete().where("agencyID", agencyID).transacting(trx)
        res.status(200).json("Delete Successful")
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Delete failed")
    }
  }
)

travelDeskRouter.post(
  "/travel-agents/:agencyID",
  RequiresAuth,
  RequiresRoleAdmin,
  async function (req: Request, res: Response) {
    try {
      await db.transaction(async (trx) => {
        const agencyID = Number(req.params.agencyID)
        const agencyData = req.body
        //console.log(agencyData)
        if (!agencyData.agencyName || !agencyData.agencyInfo)
          return res.status(500).json("Empty Payload for Agency")

        if (agencyID > 0) {
          await db("travelDeskTravelAgent")
            .update({ agencyInfo: agencyData.agencyInfo })
            .where("agencyID", agencyID)
        } else {
          await db("travelDeskTravelAgent").insert(agencyData)
        }

        res.status(200).json("Successful")
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Saving the Agency Information failed")
    }
  }
)

travelDeskRouter.post(
  "/pnr-document/:requestID",
  RequiresAuth,
  RequiresRoleTdUser,
  async function (req: Request, res: Response) {
    const file = req.body.file
    const requestID = req.params.requestID
    const data = JSON.parse(req.body.data)

    try {
      await db.transaction(async (trx) => {
        const pnrDoc = await db("travelDeskPnrDocuments")
          .select("documentID")
          .where("requestID", requestID)
          .first()
        if (pnrDoc) {
          await db("travelDeskPnrDocuments")
            .update({
              invoiceNumber: data.invoiceNumber,
              pnrDocument: file,
            })
            .where("requestID", requestID)
        } else {
          const newDocument = {
            requestID: requestID,
            invoiceNumber: data.invoiceNumber,
            pnrDocument: file,
          }
          await db("travelDeskPnrDocuments").insert(newDocument, "documentID")
        }

        if (data.agencyID) {
          await db("travelDeskTravelRequest")
            .update({
              agencyID: data.agencyID,
            })
            .where("requestID", requestID)
        }

        res.status(200).json("Successful")
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Insert failed")
    }
  }
)

travelDeskRouter.get(
  "/pnr-document/:requestID",
  RequiresAuth,
  RequiresRoleTdUser,
  async function (req, res) {
    try {
      const requestID = req.params.requestID
      const doc = await db("travelDeskPnrDocuments")
        .select("pnrDocument")
        .where("requestID", requestID)
        .first()
      res.status(200).send(doc.pnrDocument)
    } catch (error: any) {
      console.log(error)
      res.status(500).json("PDF not Found")
    }
  }
)
