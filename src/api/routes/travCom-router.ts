import express, { Request, Response } from "express";
import { RequiresAuth } from "../middleware";
import knex from "knex";
import { UserService } from "../services";
import { TRAVCOM_DB_CONFIG } from "../config";

const db = knex(TRAVCOM_DB_CONFIG);

export const travComRouter = express.Router();

travComRouter.get("/ARInvoices", RequiresAuth, async function (req: Request, res: Response) {
  const result = await db("ARInvoices").select(
    "InvoiceID",
    "InvoiceNumber",
    "ProfileNumber",
    "ProfileName",
    "Department",
    "BookingDate",
    "SystemDate",
    "Description",
    "BookingAgent",
    "InvoiceRemarks"
  );
  res.status(200).json({ data: result });
});

travComRouter.get("/ARInvoices/:id", RequiresAuth, async function (req: Request, res: Response) {
  const result = await db("ARInvoices")
    .where({ InvoiceID: req.params.id })
    .select(
      "InvoiceDetailID",
      "InvoiceID",
      "TransactionType",
      "VendorNumber",
      "VendorName",
      "ProductCode",
      "PassengerName",
      "TicketNumber",
      "PublishedFair",
      "SellingFair",
      "ReferenceFair",
      "LowFair",
      "Tax1",
      "GrossAmount",
      "CommissionAmount",
      "VatOnCommission",
      "FreeFieldA",
      "TravelDate",
      "ReturnDate",
      "NumberOfDays",
      "CityCode",
      "AddedBy"
    );
  res.status(200).json({ data: result });
});

travComRouter.get("/segments", RequiresAuth, async function (req: Request, res: Response) {
  const result = await db("segments").select(
    "segmentID",
    "invoiceID",
    "invoiceDetailsID",
    "LegNumber",
    "DepartureCityCode",
    "DepartureInfo",
    "ArrivalCityCode",
    "ArrivalInfo",
    "AirlineCode",
    "FlightNumber",
    "ClassOfService",
    "FareBasis"
  );
  res.status(200).json({ data: result });
});
