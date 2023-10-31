import { Request, Response, NextFunction } from "express"

import dbLegacy from "@/db/db-client-legacy"
import db from "@/db/db-client"

export async function databaseHealthCheckMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await dbLegacy.raw("SELECT 1")
    console.log("Legacy knex database connection has been established successfully.")

    await db.authenticate()
    console.log("Sequelize database connection has been established successfully.")

    return next()
  } catch (error) {
    console.error(`Database health check failed with: ${error}`)
    res.status(503).json({ message: "Database health check failed." })
  }
}

export default databaseHealthCheckMiddleware
