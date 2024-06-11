import express, { Request, Response } from "express";
import { RequiresAuth, RequiresRoleAdmin, RequiresRoleTdUser, RequiresRoleTdUserOrAdmin } from "../middleware";
import { DB_CONFIG } from "../config";
import knex from "knex";
import logger from "@/utils/logger"

const db = knex(DB_CONFIG);

export const reconcileRouter = express.Router();

reconcileRouter.get("/", RequiresAuth, async function (req: Request, res: Response) {

  const reconciledFlights = await db("flightReconciliation").select("*");

  res.status(200).json(reconciledFlights);
});


reconcileRouter.post("/", RequiresAuth, async function (req: Request, res: Response) {

  try {

    await db.transaction(async trx => {
      const reconcileFlights = req.body
      // const existingReconcileFlights = reconcileFlights.filter((flight: any) => flight.reconcileID)
      const invoiceDetailID = reconcileFlights.map((req: any) => req.invoiceDetailID)

      await db("flightReconciliation").delete().whereIn("invoiceDetailID", invoiceDetailID);

      for(const newReconcileFlight of reconcileFlights){
        await db("flightReconciliation").insert(newReconcileFlight);
      }
      res.status(200).json("Successful");
    });
  } catch (error: any) {
    logger.info(error);
    res.status(500).json("Saving the Flight Reconciliations failed");
  }
});
