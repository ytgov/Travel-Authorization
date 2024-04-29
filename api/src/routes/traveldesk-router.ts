import { isNull, minBy } from "lodash"
import express, { Request, Response } from "express"
import { Op, WhereOptions } from "sequelize"

import {
  RequiresAuth,
  RequiresRoleAdmin,
  RequiresRoleTdUser,
  RequiresRoleTdUserOrAdmin,
} from "@/middleware"
import {
  TravelAuthorization,
  TravelDeskFlightRequest,
  TravelDeskHotel,
  TravelDeskOtherTransportation,
  TravelDeskPassengerNameRecordDocument,
  TravelDeskRentalCar,
  TravelDeskTravelRequest,
  User,
} from "@/models"

import db from "@/db/db-client"
import dbLegacy from "@/db/db-client-legacy"

/** @deprecated - prefer using controller pattern with per-model CRUD actions */
export const travelDeskRouter = express.Router()

travelDeskRouter.get("/", RequiresAuth, async function (req: Request, res: Response) {
  const travelRequests = await TravelDeskTravelRequest.findAll({
    where: {
      status: {
        [Op.ne]: TravelDeskTravelRequest.Statuses.DRAFT,
      },
    },
    include: [
      "flightRequests",
      "hotels",
      "otherTransportations",
      "rentalCars",
      {
        association: "travelAuthorization",
        include: ["stops"],
      },
      {
        association: "travelDeskPassengerNameRecordDocument",
        attributes: ["invoiceNumber"],
      },
    ],
  })

  for (const travelRequest of travelRequests) {
    const traveRequestId = travelRequest.id

    // @ts-expect-error - not worth fixing at this time, belongs in a serializer
    travelRequest.form = travelRequest.travelAuthorization
    delete travelRequest.travelAuthorization

    const questions = await dbLegacy("travelDeskQuestion")
      .select("*")
      .where("requestID", traveRequestId)
    for (const question of questions) {
      question.state = { questionErr: false, responseErr: false }
    }
    // @ts-expect-error - not worth fixing at this time, belongs in a serializer
    travelRequest.questions = questions

    // @ts-expect-error - not worth fixing at this time, belongs in a serializer
    travelRequest.invoiceNumber =
      travelRequest.travelDeskPassengerNameRecordDocument?.invoiceNumber || ""
  }

  res.status(200).json(travelRequests)
})

travelDeskRouter.get(
  "/authorized-travels/",
  RequiresAuth,
  async function (req: Request, res: Response) {
    const adminScoping: WhereOptions<TravelAuthorization> = {}
    if (req?.user?.roles?.includes(User.Roles.ADMIN)) {
      // No additional conditions for Admin, selects all records
    } else if (req?.user?.roles?.includes(User.Roles.DEPARTMENT_ADMIN)) {
      adminScoping.department = req.user.department
    } else {
      adminScoping.userId = req.user.id
    }

    try {
      const forms = await TravelAuthorization.findAll({
        where: adminScoping,
        include: ["stops", "travelDeskTravelRequest"],
      })

      // TODO: move this code to a serializer
      for (const form of forms) {
        const stops = form.stops
        const earliestStop = minBy(stops, (stop) => {
          return `${stop.departureDate} ${stop.departureTime}`
        })
        // @ts-expect-error - this code is deprecated so not worth fixing the type issues
        form.departureDate = earliestStop?.departureDate || "Unknown"
        // @ts-expect-error - this code is deprecated so not worth fixing the type issues
        form.departureTime = earliestStop?.departureTime || "Unknown"

        // @ts-expect-error - isn't worth fixing at this time
        form.travelRequest = form.travelDeskTravelRequest
        delete form.travelDeskTravelRequest

        // @ts-expect-error - isn't worth fixing at this time
        const travelDeskTravelRequestId = form.travelRequest?.id
        if (travelDeskTravelRequestId) {
          const travelDeskPnrDocument = await TravelDeskPassengerNameRecordDocument.findOne({
            attributes: ["invoiceNumber"],
            where: { travelDeskTravelRequestId },
          })

          // @ts-expect-error - isn't worth fixing at this time
          form.travelRequest.invoiceNumber = travelDeskPnrDocument?.invoiceNumber || ""
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

    const flightOptions = await dbLegacy("travelDeskFlightOption")
      .select("*")
      .where("flightRequestID", flightRequestID)
    for (const flightOption of flightOptions) {
      const flightSegments = await dbLegacy("travelDeskFlightSegment")
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
  "/flight-options/:travelDeskTravelRequestId",
  RequiresAuth,
  async function (req: Request, res: Response) {
    try {
      const travelDeskTravelRequestId = Number(req.params.travelDeskTravelRequestId)
      const newFlightOptions = req.body
      //console.log(newFlightOptions)
      if (newFlightOptions.length < 1 || !travelDeskTravelRequestId)
        return res.status(422).json("Empty Payload for Flight Options")

      const flightRequestsIds = await TravelDeskFlightRequest.findAll({
        attributes: ["id"],
        where: { id: travelDeskTravelRequestId },
      })
      const flightRequestIDs = flightRequestsIds.map((flightRequest) => flightRequest.id)

      await dbLegacy.transaction(async (trx) => {
        await dbLegacy("travelDeskFlightOption")
          .delete()
          .whereIn("flightRequestID", flightRequestIDs)

        for (const newFlightOption of newFlightOptions) {
          delete newFlightOption.state

          const flightSegments = newFlightOption.flightSegments
          delete newFlightOption.flightSegments

          const id = await dbLegacy("travelDeskFlightOption").insert(
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
            await dbLegacy("travelDeskFlightSegment").insert(flightSegment)
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
  "/flight-options/:travelDeskTravelRequestId",
  RequiresAuth,
  RequiresRoleTdUser,
  async function (req: Request, res: Response) {
    try {
      const travelDeskTravelRequestId = Number(req.params.travelDeskTravelRequestId)
      const flightRequestsIds = await TravelDeskFlightRequest.findAll({
        attributes: ["id"],
        where: { travelRequestId: travelDeskTravelRequestId },
      })
      const flightRequestIDs = flightRequestsIds.map((flightRequest) => flightRequest.id)

      await dbLegacy.transaction(async (trx) => {
        await dbLegacy("travelDeskFlightOption")
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
  "/flight-request/:travelDeskTravelRequestId",
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

    const travelDeskTravelRequestId = Number(req.params.travelDeskTravelRequestId)

    if (travelDeskTravelRequestId) {
      let tmpId = 3000

      const flightRequests = await TravelDeskFlightRequest.findAll({
        where: { travelRequestId: travelDeskTravelRequestId },
      })
      for (const flightRequest of flightRequests) {
        const flightOptions = await dbLegacy("travelDeskFlightOption")
          .select("*")
          .where("flightRequestID", flightRequest.id)
        for (const flightOption of flightOptions) {
          const flightSegments = await dbLegacy("travelDeskFlightSegment")
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
        // @ts-expect-error - not worth fixing at this time
        flightRequest.flightOptions = flightOptions
      }
      res.status(200).json(flightRequests)
    } else res.status(500).json("Missing all parameters!")
  }
)

travelDeskRouter.post(
  "/flight-request/:travelDeskTravelRequestId",
  RequiresAuth,
  async function (req: Request, res: Response) {
    // TODO: use managed Sequelize transaction once all database access is through Sequelize
    const sequelizeTransaction = await db.transaction()
    try {
      await dbLegacy.transaction(async (trx) => {
        const travelDeskTravelRequestId = Number(req.params.travelDeskTravelRequestId)
        const flightRequests = req.body
        // console.log(flightRequests)

        if (travelDeskTravelRequestId) {
          await TravelDeskFlightRequest.destroy({
            where: { travelRequestId: travelDeskTravelRequestId },
            transaction: sequelizeTransaction,
          })

          for (const flightRequest of flightRequests) {
            const newFlightOptions = flightRequest.flightOptions
            delete flightRequest.flightOptions
            delete flightRequest.tmpId
            if (flightRequest.flightRequestID == null) delete flightRequest.flightRequestID

            flightRequest.travelRequestId = travelDeskTravelRequestId

            const newFlightRequest = await TravelDeskFlightRequest.create(flightRequest, {
              transaction: sequelizeTransaction,
            })

            await dbLegacy("travelDeskFlightOption")
              .delete()
              .where("flightRequestID", newFlightRequest.id)

            for (const newFlightOption of newFlightOptions) {
              delete newFlightOption.state

              const flightSegments = newFlightOption.flightSegments
              delete newFlightOption.flightSegments

              newFlightOption.flightRequestID = newFlightRequest.id

              const id = await dbLegacy("travelDeskFlightOption").insert(
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
                await dbLegacy("travelDeskFlightSegment").insert(flightSegment)
              }
            }
          }
          await sequelizeTransaction.commit()
          res.status(200).json("Successful")
        } else {
          res.status(500).json("Required fields in submission are blank")
        }
      })
    } catch (error: any) {
      console.log(error)
      await sequelizeTransaction.rollback()
      res.status(500).json("Saving the Flight Request failed")
    }
  }
)

travelDeskRouter.get(
  "/travel-request/:travelAuthorizationId",
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

    const travelAuthorizationId = req.params.travelAuthorizationId
    const travelRequest = await TravelDeskTravelRequest.findOne({
      where: { travelAuthorizationId },
      include: [
        "flightRequests",
        "hotels",
        "otherTransportations",
        "rentalCars",
        {
          association: "travelDeskPassengerNameRecordDocument",
          attributes: ["invoiceNumber"],
        },
      ],
    })

    // TODO: move this code to a serializer
    if (travelRequest) {
      const travelRequestId = travelRequest.id

      let tmpId = 1000

      for (const flightRequest of travelRequest.flightRequests || []) {
        const flightOptions = await dbLegacy("travelDeskFlightOption")
          .select("*")
          .where("flightRequestID", flightRequest.id)
        for (const flightOption of flightOptions) {
          const flightSegments = await dbLegacy("travelDeskFlightSegment")
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
        // @ts-expect-error - not worth fixing at this time
        flightRequest.flightOptions = flightOptions
      }

      const questions = await dbLegacy("travelDeskQuestion")
        .select("*")
        .where("requestID", travelRequestId)
      for (const question of questions) {
        question.state = { questionErr: false, responseErr: false }
      }
      // @ts-expect-error - not worth fixing at this time
      travelRequest.questions = questions

      // @ts-expect-error - not worth fixing at this time
      travelRequest.invoiceNumber =
        travelRequest.travelDeskPassengerNameRecordDocument?.invoiceNumber || ""
      delete travelRequest.travelDeskPassengerNameRecordDocument
    }

    res.status(200).json(travelRequest)
  }
)

travelDeskRouter.post(
  "/travel-request/:travelAuthorizationId",
  RequiresAuth,
  async function (req: Request, res: Response) {
    console.warn(
      "Deprecated: travel requests are now created during TravelAuthorization approval service action."
    )
    const sequelizeTransaction = await db.transaction()
    try {
      await dbLegacy.transaction(async (trx) => {
        const travelAuthorizationId = Number(req.params.travelAuthorizationId)
        const newTravelRequest = req.body
        // console.log(newTravelRequest)

        if (travelAuthorizationId) {
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

          const [travelRequest, _created] = await TravelDeskTravelRequest.upsert({
            ...newTravelRequest,
            travelAuthorizationId,
          })

          if (isNull(travelRequest)) {
            return res.status(422).json({ message: "Failed to upsert travel request" })
          }

          //FlightRequests
          await TravelDeskFlightRequest.destroy({
            where: { travelRequestId: travelRequest.id },
            transaction: sequelizeTransaction,
          })

          for (const flightRequest of flightRequests) {
            const newFlightOptions = flightRequest.flightOptions
            delete flightRequest.flightOptions
            delete flightRequest.tmpId
            if (flightRequest.id == null) {
              delete flightRequest.id
            }

            flightRequest.travelRequestId = travelRequest.id

            const newFlightRequest = await TravelDeskFlightRequest.create(flightRequest, {
              transaction: sequelizeTransaction,
            })

            await dbLegacy("travelDeskFlightOption")
              .delete()
              .where("flightRequestID", newFlightRequest.id)

            for (const newFlightOption of newFlightOptions) {
              delete newFlightOption.state

              const flightSegments = newFlightOption.flightSegments
              delete newFlightOption.flightSegments

              newFlightOption.flightRequestID = newFlightRequest.id

              const travelDeskFlighOption = await dbLegacy("travelDeskFlightOption").insert(
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
                flightSegment.flightOptionID = travelDeskFlighOption[0].flightOptionID
                await dbLegacy("travelDeskFlightSegment").insert(flightSegment)
              }
            }
          }

          //RentalCars
          await TravelDeskRentalCar.destroy({
            where: { travelRequestId: travelRequest.id },
            transaction: sequelizeTransaction,
          })

          for (const rentalCar of rentalCars) {
            delete rentalCar.tmpId
            if (rentalCar.id == null) {
              delete rentalCar.id
            }
            rentalCar.travelRequestId = travelRequest.id
            await TravelDeskRentalCar.create(rentalCar, { transaction: sequelizeTransaction })
          }

          //Hotels
          await TravelDeskHotel.destroy({
            where: { travelRequestId: travelRequest.id },
            transaction: sequelizeTransaction,
          })

          for (const hotel of hotels) {
            delete hotel.tmpId
            if (hotel.id == null) {
              delete hotel.id
            }
            hotel.travelRequestId = travelRequest.id

            await TravelDeskHotel.create(hotel, { transaction: sequelizeTransaction })
          }

          //Other Transportations
          await TravelDeskOtherTransportation.destroy({
            where: { travelRequestId: travelRequest.id },
            transaction: sequelizeTransaction,
          })

          for (const otherTransportation of otherTransportations) {
            delete otherTransportation.tmpId
            if (otherTransportation.id == null) {
              delete otherTransportation.id
            }
            otherTransportation.travelRequestId = travelRequest.id
            await TravelDeskOtherTransportation.create(otherTransportation, {
              transaction: sequelizeTransaction,
            })
          }

          //Questions
          await dbLegacy("travelDeskQuestion").delete().where("requestID", travelRequest.id)

          for (const question of questions) {
            delete question.tmpId
            delete question.state
            if (question.questionID == null) delete question.questionID
            question.requestID = travelRequest.id
            await dbLegacy("travelDeskQuestion").insert(question)
          }

          await sequelizeTransaction.commit()

          res.status(200).json("Successful")
        } else {
          res.status(500).json("Required fields in submission are blank")
        }
      })
    } catch (error: any) {
      console.log(error)
      await sequelizeTransaction.rollback()
      res.status(500).json("Saving the Travel Request failed")
    }
  }
)

travelDeskRouter.get(
  "/travel-agents/",
  RequiresAuth,
  RequiresRoleTdUserOrAdmin,
  async function (req: Request, res: Response) {
    const travelAgents = await dbLegacy("travelDeskTravelAgent").select("*")
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

      await dbLegacy.transaction(async (trx) => {
        await dbLegacy("travelDeskTravelAgent")
          .delete()
          .where("agencyID", agencyID)
          .transacting(trx)
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
      await dbLegacy.transaction(async (trx) => {
        const agencyID = Number(req.params.agencyID)
        const agencyData = req.body
        //console.log(agencyData)
        if (!agencyData.agencyName || !agencyData.agencyInfo)
          return res.status(500).json("Empty Payload for Agency")

        if (agencyID > 0) {
          await dbLegacy("travelDeskTravelAgent")
            .update({ agencyInfo: agencyData.agencyInfo })
            .where("agencyID", agencyID)
        } else {
          await dbLegacy("travelDeskTravelAgent").insert(agencyData)
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
  "/pnr-document/:travelDeskTravelRequestId",
  RequiresAuth,
  RequiresRoleTdUser,
  async function (req: Request, res: Response) {
    const file = req.body.file
    const travelDeskTravelRequestId = parseInt(req.params.travelDeskTravelRequestId)
    const data = JSON.parse(req.body.data)
    const { invoiceNumber, travelDeskTravelAgentId } = data

    return db
      .transaction(async () => {
        await TravelDeskPassengerNameRecordDocument.upsert({
          travelDeskTravelRequestId,
          invoiceNumber,
          pnrDocument: file,
        })

        if (travelDeskTravelAgentId) {
          await TravelDeskTravelRequest.update(
            {
              travelDeskTravelAgentId,
            },
            {
              where: { id: travelDeskTravelRequestId },
            }
          )
        }

        res.status(200).json("Successful")
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json("Insert failed")
      })
  }
)

travelDeskRouter.get(
  "/pnr-document/:travelDeskTravelRequestId",
  RequiresAuth,
  RequiresRoleTdUser,
  async function (req, res) {
    try {
      const travelDeskTravelRequestId = req.params.travelDeskTravelRequestId
      const doc = await TravelDeskPassengerNameRecordDocument.findOne({
        where: { travelDeskTravelRequestId },
      })

      if (isNull(doc)) {
        return res.status(404).json({ message: "No PNR Document found" })
      }

      res.status(200).send(doc.pnrDocument)
    } catch (error: any) {
      console.log(error)
      res.status(500).json("PDF not Found")
    }
  }
)
