import express, { Request, Response } from "express";
import { RequiresAuth } from "../middleware";
import knex from "knex";
import { UserService } from "../services";
import { TRAVCOM_DB_CONFIG } from "../config";

const db = knex(TRAVCOM_DB_CONFIG);

export const travComRouter = express.Router();

travComRouter.get("/ARInvoices", RequiresAuth, async function (req: Request, res: Response) {
  const result = await db("dbo.ARInvoicesNoHealth").select();
  res.status(200).json({ data: result });
});

travComRouter.get("/ARInvoices/:id", RequiresAuth, async function (req: Request, res: Response) {
  const result = await db("dbo.ARInvoicesNoHealth").where({ InvoiceID: req.params.id }).select();
  res.status(200).json({ data: result });
});

travComRouter.get("/ARInvoiceDetails", RequiresAuth, async function (req: Request, res: Response) {
  const result = await db("dbo.ARInvoiceDetailsNoHealth").select();
  res.status(200).json({ data: result });
});

travComRouter.get("/ARInvoiceDetails/:id", RequiresAuth, async function (req: Request, res: Response) {
  const result = await db("dbo.ARInvoiceDetailsNoHealth").where({ InvoiceID: req.params.id }).select();
  res.status(200).json({ data: result });
});

travComRouter.get("/segments", RequiresAuth, async function (req: Request, res: Response) {
  const result = await db("dbo.segmentsNoHealth").select();
  res.status(200).json({ data: result });
});

travComRouter.get("/segments/:id", RequiresAuth, async function (req: Request, res: Response) {
  const result = await db("dbo.segmentsNoHealth").where({ InvoiceID: req.params.id }).select();
  res.status(200).json({ data: result });
});
