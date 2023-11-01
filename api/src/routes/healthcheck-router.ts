import express, { Request, Response } from "express"
import { DB_CONFIG, API_PORT, FRONTEND_URL, NODE_ENV } from "@/config"

export const healthCheckRouter = express.Router()

healthCheckRouter.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    appHealth: {
      apiPort: API_PORT,
      frontendUrl: FRONTEND_URL,
      nodeEnd: NODE_ENV,
    },
    dbHealth: {
      connection: DB_CONFIG.connection.host,
      database: DB_CONFIG.connection.database,
      user: DB_CONFIG.connection.user,
      port: DB_CONFIG.connection.port,
    },
    // TODO: figure out how to inject these into the back-end image.
    // environment: {
    //   releaseTag: process.env.RELEASE_TAG,
    //   gitCommitHash: process.env.GIT_COMMIT_HASH,
    // },
  })
})
