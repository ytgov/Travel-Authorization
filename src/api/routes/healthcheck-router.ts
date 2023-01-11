import express, { Request, Response } from "express";
import { ReturnValidationErrors } from "../middleware";
import { DB_CONFIG, API_PORT, FRONTEND_URL, NODE_ENV } from "../config";

export const healthCheckRouter = express.Router();

healthCheckRouter.get("/", ReturnValidationErrors, async function (req: Request, res: Response) {
  try {
    let dbHealth = {
      Connection: DB_CONFIG.connection.host,
      Database: DB_CONFIG.connection.database,
      User: DB_CONFIG.connection.user,
      Port: DB_CONFIG.connection.port
    };
    let appHealth = {
      ApiPort: API_PORT,
      FrontendUrl: FRONTEND_URL,
      NodeEnd: NODE_ENV
    };
    res.status(200).json({
      appHealth,
      dbHealth
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
});
