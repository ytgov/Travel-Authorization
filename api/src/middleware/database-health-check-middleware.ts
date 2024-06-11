import { Request, Response, NextFunction } from "express"

import { NODE_ENV } from "@/config"
import dbLegacy from "@/db/db-client-legacy"
import db from "@/db/db-client"
import logger from "@/utils/logger"

let isDatabaseConnectionHealthly = false

// TODO: make this a generic error hanlder instead and suppress logs?
// It's clearly not something that should spam the logs on every request.
export async function databaseHealthCheckMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (isDatabaseConnectionHealthly) return next()

  try {
    await dbLegacy.raw("SELECT 1")
    if (NODE_ENV !== "test") {
      logger.info("Legacy knex database connection has been established successfully.")
    }

    await db.authenticate()
    if (NODE_ENV !== "test") {
      logger.info("Sequelize database connection has been established successfully.")
    }

    isDatabaseConnectionHealthly = true

    return next()
  } catch (error) {
    logger.error(`Database health check failed with: ${error}`)
    res.status(503).json({ message: "Database health check failed." })
  }
}

export default databaseHealthCheckMiddleware
