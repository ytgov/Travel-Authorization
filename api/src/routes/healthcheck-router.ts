import express, { Request, Response } from "express"
import { DB_CONFIG, API_PORT, FRONTEND_URL, NODE_ENV, GIT_COMMIT_HASH, RELEASE_TAG } from "@/config"

export const healthCheckRouter = express.Router()

healthCheckRouter.get("/", (_req: Request, res: Response) => {
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
    environment: {
      releaseTag: RELEASE_TAG,
      gitCommitHash: GIT_COMMIT_HASH,
    },
  })
})
