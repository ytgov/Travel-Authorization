import { isNil, isNull, minBy } from "lodash"
import express, { Request, Response } from "express"
import { CreationAttributes, Op, WhereOptions } from "sequelize"

import logger from "@/utils/logger"
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
  TravelDeskQuestion,
  TravelDeskRentalCar,
  TravelDeskTravelRequest,
  User,
} from "@/models"

import db from "@/db/db-client"
import { knexQueryToSequelizeSelect } from "@/db/utils/knex-query-to-sequelize-select"
import dbLegacy from "@/db/db-client-legacy"

/** @deprecated - prefer using controller pattern with per-model CRUD actions */
export const travelDeskRouter = express.Router()

travelDeskRouter.get("/", RequiresAuth, async function (_req: Request, res: Response) {
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
      "questions",
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
    // @ts-expect-error - not worth fixing at this time, belongs in a serializer
    travelRequest.form = travelRequest.travelAuthorization
    delete travelRequest.travelAuthorization

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
    } catch (error: unknown) {
      logger.info(error)
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
      //logger.info(newFlightOptions)
      if (newFlightOptions.length < 1 || !travelDeskTravelRequestId)
        return res.status(422).json("Empty Payload for Flight Options")

      const flightRequestsIds = await TravelDeskFlightRequest.findAll({
        attributes: ["id"],
        where: { id: travelDeskTravelRequestId },
      })
      const flightRequestIDs = flightRequestsIds.map((flightRequest) => flightRequest.id)

      await dbLegacy.transaction(async () => {
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
            // logger.info(flightSegment)
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
    } catch (error: unknown) {
      logger.info(error)
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
    } catch (error: unknown) {
      logger.info(error)
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
    try {
      return db.transaction(async () => {
        const travelDeskTravelRequestId = Number(req.params.travelDeskTravelRequestId)
        const flightRequests = req.body
        // logger.info(flightRequests)

        if (travelDeskTravelRequestId) {
          await TravelDeskFlightRequest.destroy({
            where: { travelRequestId: travelDeskTravelRequestId },
          })

          for (const flightRequest of flightRequests) {
            const newFlightOptions = flightRequest.flightOptions
            delete flightRequest.flightOptions
            delete flightRequest.tmpId
            if (flightRequest.flightRequestID == null) delete flightRequest.flightRequestID

            flightRequest.travelRequestId = travelDeskTravelRequestId

            const newFlightRequest = await TravelDeskFlightRequest.create(flightRequest)

            await knexQueryToSequelizeSelect(
              dbLegacy("travelDeskFlightOption")
                .delete()
                .where("flightRequestID", newFlightRequest.id)
            )

            for (const newFlightOption of newFlightOptions) {
              delete newFlightOption.state

              const flightSegments = newFlightOption.flightSegments
              delete newFlightOption.flightSegments

              newFlightOption.flightRequestID = newFlightRequest.id

              const id = await knexQueryToSequelizeSelect<{
                flightOptionID: number
              }>(dbLegacy("travelDeskFlightOption").insert(newFlightOption, "flightOptionID"))

              for (const flightSegment of flightSegments) {
                // logger.info(flightSegment)
                delete flightSegment.tmpId
                delete flightSegment.state
                delete flightSegment.departDay
                delete flightSegment.departTime
                delete flightSegment.arriveDay
                delete flightSegment.arriveTime
                flightSegment.flightOptionID = id[0].flightOptionID
                await knexQueryToSequelizeSelect(
                  dbLegacy("travelDeskFlightSegment").insert(flightSegment)
                )
              }
            }
          }
          return res.status(200).json("Successful")
        } else {
          return res.status(500).json("Required fields in submission are blank")
        }
      })
    } catch (error: unknown) {
      logger.info(error)
      res.status(500).json("Saving the Flight Request failed")
    }
  }
)

travelDeskRouter.get(
  "/travel-request/:travelDeskTravelRequestId",
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

    const travelDeskTravelRequestId = req.params.travelDeskTravelRequestId
    const travelRequest = await TravelDeskTravelRequest.findByPk(travelDeskTravelRequestId, {
      include: [
        "flightRequests",
        "hotels",
        "otherTransportations",
        "questions",
        "rentalCars",
        {
          association: "travelDeskPassengerNameRecordDocument",
          attributes: ["invoiceNumber"],
        },
      ],
    })
    if (isNil(travelRequest)) {
      return res.status(404).json({ message: "No Travel Request found" })
    }

    // TODO: move this code to a serializer
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

    // @ts-expect-error - not worth fixing at this time
    travelRequest.invoiceNumber =
      travelRequest.travelDeskPassengerNameRecordDocument?.invoiceNumber || ""
    delete travelRequest.travelDeskPassengerNameRecordDocument

    res.status(200).json(travelRequest)
  }
)

travelDeskRouter.post(
  "/travel-request/:travelDeskTravelRequestId",
  RequiresAuth,
  async function (req: Request, res: Response) {
    logger.warn(
      "Deprecated: travel requests are now created during TravelAuthorization approval service action."
    )
    try {
      const travelDeskTravelRequestId = Number(req.params.travelDeskTravelRequestId)
      if (isNil(travelDeskTravelRequestId) || isNaN(travelDeskTravelRequestId)) {
        return res.status(422).json("Missing travelDeskTravelRequestId parameter.")
      }

      const newTravelRequest = req.body
      delete newTravelRequest.invoiceNumber

      const flightRequests = newTravelRequest.flightRequests
      delete newTravelRequest.flightRequests

      const rentalCars = newTravelRequest.rentalCars
      delete newTravelRequest.rentalCars

      const hotels = newTravelRequest.hotels
      delete newTravelRequest.hotels

      const otherTransportations = newTravelRequest.otherTransportation || []
      delete newTravelRequest.otherTransportation

      const questions = newTravelRequest.questions
      delete newTravelRequest.questions
      return db.transaction(async () => {
        // logger.info(newTravelRequest)

        let travelRequest = await TravelDeskTravelRequest.findByPk(travelDeskTravelRequestId)
        if (isNil(travelRequest)) {
          travelRequest = await TravelDeskTravelRequest.create(newTravelRequest)
        } else {
          await travelRequest.update(newTravelRequest)
        }

        //FlightRequests
        await TravelDeskFlightRequest.destroy({
          where: { travelRequestId: travelRequest.id },
        })

        for (const flightRequest of flightRequests) {
          const newFlightOptions = flightRequest.flightOptions
          delete flightRequest.flightOptions

          delete flightRequest.tmpId
          delete flightRequest.id
          flightRequest.travelRequestId = travelRequest.id
          const newFlightRequest = await TravelDeskFlightRequest.create(flightRequest)

          await knexQueryToSequelizeSelect(
            dbLegacy("travelDeskFlightOption")
              .delete()
              .where("flightRequestID", newFlightRequest.id)
          )

          for (const newFlightOption of newFlightOptions) {
            delete newFlightOption.state

            const flightSegments = newFlightOption.flightSegments
            delete newFlightOption.flightSegments

            newFlightOption.flightRequestID = newFlightRequest.id

            const travelDeskFlighOption = await knexQueryToSequelizeSelect<{
              flightOptionID: number
            }>(dbLegacy("travelDeskFlightOption").insert(newFlightOption, "flightOptionID"))

            for (const flightSegment of flightSegments) {
              // logger.info(flightSegment)
              delete flightSegment.tmpId
              delete flightSegment.state
              delete flightSegment.departDay
              delete flightSegment.departTime
              delete flightSegment.arriveDay
              delete flightSegment.arriveTime
              flightSegment.flightOptionID = travelDeskFlighOption[0].flightOptionID
              await knexQueryToSequelizeSelect(
                dbLegacy("travelDeskFlightSegment").insert(flightSegment)
              )
            }
          }
        }

        //RentalCars
        await TravelDeskRentalCar.destroy({
          where: { travelRequestId: travelRequest.id },
        })

        const cleanRentalCars = rentalCars.map(
          (
            rentalCar: CreationAttributes<TravelDeskRentalCar> & {
              id?: number
              tmpId?: number
            }
          ) => {
            delete rentalCar.tmpId
            delete rentalCar.id
            if (isNil(travelRequest)) {
              throw new Error("Travel Request is null")
            }

            rentalCar.travelRequestId = travelRequest.id
            return rentalCar
          }
        )
        await TravelDeskRentalCar.bulkCreate(cleanRentalCars)

        //Hotels
        await TravelDeskHotel.destroy({
          where: { travelRequestId: travelRequest.id },
        })

        const cleanHotels = hotels.map(
          (
            hotel: CreationAttributes<TravelDeskHotel> & {
              id?: number
              tmpId?: number
            }
          ) => {
            delete hotel.tmpId
            delete hotel.id
            if (isNil(travelRequest)) {
              throw new Error("Travel Request is null")
            }

            hotel.travelRequestId = travelRequest.id
            return hotel
          }
        )
        await TravelDeskHotel.bulkCreate(cleanHotels)

        //Other Transportations
        await TravelDeskOtherTransportation.destroy({
          where: { travelRequestId: travelRequest.id },
        })

        const cleanOtherTransportations = otherTransportations.map(
          (
            otherTransportation: CreationAttributes<TravelDeskOtherTransportation> & {
              id?: number
              tmpId?: number
            }
          ) => {
            delete otherTransportation.tmpId
            delete otherTransportation.id
            if (isNil(travelRequest)) {
              throw new Error("Travel Request is null")
            }

            otherTransportation.travelRequestId = travelRequest.id
            return otherTransportation
          }
        )
        await TravelDeskOtherTransportation.bulkCreate(cleanOtherTransportations)

        //Questions
        await TravelDeskQuestion.destroy({
          where: { travelRequestId: travelRequest.id },
        })

        const cleanQuestions = questions.map(
          (
            question: CreationAttributes<TravelDeskQuestion> & {
              tmpId?: number
              state?: Record<string, boolean>
            }
          ) => {
            delete question.tmpId
            delete question.state
            delete question.id
            if (isNil(travelRequest)) {
              throw new Error("Travel Request is null")
            }

            question.travelRequestId = travelRequest.id
            return question
          }
        )
        await TravelDeskQuestion.bulkCreate(cleanQuestions)

        return res.status(200).json("Successful")
      })
    } catch (error: unknown) {
      logger.info(error)
      res.status(500).json("Saving the Travel Request failed")
    }
  }
)

travelDeskRouter.get(
  "/travel-agents/",
  RequiresAuth,
  RequiresRoleTdUserOrAdmin,
  async function (_req: Request, res: Response) {
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
    } catch (error: unknown) {
      logger.info(error)
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
      await dbLegacy.transaction(async () => {
        const agencyID = Number(req.params.agencyID)
        const agencyData = req.body
        //logger.info(agencyData)
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
    } catch (error: unknown) {
      logger.info(error)
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
        logger.info(error)
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
    } catch (error: unknown) {
      logger.info(error)
      res.status(500).json("PDF not Found")
    }
  }
)
