import { Router, type Request, type Response } from "express"

import dbLegacy from "@/db/db-client-legacy"

export const migrateRouter = Router()

migrateRouter.get("/migrate/up", async (req: Request, res: Response) => {
  console.log("-------- MIGRATE UP ---------")
  return dbLegacy.migrate
    .up()
    .then((result) => {
      return res.json(result)
    })
    .catch((error) => {
      res.status(422).json({ message: `Failed to migrate: ${error}` })
    })
})

migrateRouter.get("/migrate/down", async (req: Request, res: Response) => {
  console.log("-------- MIGRATE DOWN ---------")
  return dbLegacy.migrate
    .down()
    .then((result) => {
      return res.json(result)
    })
    .catch((error) => {
      res.status(422).json({ message: `Failed to migrate: ${error}` })
    })
})

migrateRouter.get("/migrate/latest", async (req: Request, res: Response) => {
  console.log("-------- MIGRATE LATEST ---------")
  return dbLegacy.migrate
    .latest()
    .then((result) => {
      return res.json(result)
    })
    .catch((error) => {
      res.status(422).json({ message: `Failed to migrate: ${error}` })
    })
})

migrateRouter.get("/migrate/seed", async (req: Request, res: Response) => {
  console.log("-------- MIGRATE SEED ---------")
  return dbLegacy.seed
    .run()
    .then((result) => {
      return res.json(result)
    })
    .catch((error) => {
      res.status(422).json({ message: `Failed to seed: ${error}` })
    })
})
