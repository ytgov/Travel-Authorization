import express, { Request, Response } from "express";
import { ReturnValidationErrors } from "../middleware";
import { DB_CONFIG } from "../config";
import knex from "knex";
import { UserService } from "../services";
import { v4 as uuid } from "uuid";
import * as formHelper from "../utils/formHelper";
import { auth } from "express-openid-connect";

const db = knex(DB_CONFIG);

export const managerRouter = express.Router();
const userService = new UserService();

managerRouter.get("/forms/:formId", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let user = await userService.getByEmail(req.user.email);
    let auth = await db("forms")
      .select("*")
      .where("supervisorEmail", "=", user.email)
      .andWhere("formid", "=", req.params.formId)
      .first();

    if (auth) {
      auth.stops = await db("stops").select("*").where("taid", "=", auth.id);

      res.status(200).json(auth);
    } else {
      res.status(404).json("Form not found");
    }

    res.status(200).json(auth);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});

managerRouter.get("/forms", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let user = await userService.getByEmail(req.user.email);
    let auth = await db("forms").select("*").where("supervisorEmail", "=", user.email);

    for (let index = 0; index < auth.length; index++) {
      auth[index].stops = await db("stops").select("*").where("taid", "=", auth[index].id);
      let departureDate = await db("stops").min("departureDate").where("taid", "=", auth[index].id);
      auth[index].departureDate = departureDate[0].min;
    }
    res.status(200).json(auth);
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});
