import express, { Request, Response } from "express"
import knex from "knex"

import { DB_CONFIG } from "@/config"
import logger from "@/utils/logger"
import { RequiresAuth } from "@/middleware"
import { FlightReconciliation } from "@/models"

const db = knex(DB_CONFIG)

export const reconcileRouter = express.Router()

reconcileRouter.get("/", RequiresAuth, async function (_req: Request, res: Response) {
  const reconciledFlights = await FlightReconciliation.findAll()

  res.status(200).json(reconciledFlights)
})

reconcileRouter.post("/", RequiresAuth, async function (req: Request, res: Response) {
  try {
    await db.transaction(async () => {
      const reconcileFlights = req.body
      // const existingReconcileFlights = reconcileFlights.filter((flight: any) => flight.reconcileID)
      const invoiceDetailIDs = reconcileFlights.map((req: any) => req.invoiceDetailID)

      await FlightReconciliation.destroy({
        where: {
          externalTravComIdentifier: invoiceDetailIDs,
        },
      })

      for (const newReconcileFlight of reconcileFlights) {
        await FlightReconciliation.create(newReconcileFlight)
      }

      res.status(200).json("Successful")
    })
  } catch (error: any) {
    logger.info(error)
    res.status(500).json("Saving the Flight Reconciliations failed")
  }
})
