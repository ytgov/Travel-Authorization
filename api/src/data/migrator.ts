import { Express, Request, Response } from "express"

import dbLegacy from "@/db/db-client-legacy"
import { seedUp } from "./seeds"

export async function CreateMigrationRoutes(app: Express) {
  app.get("/migrate/up", async (req: Request, res: Response) => {
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

  app.get("/migrate/down", async (req: Request, res: Response) => {
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

  app.get("/migrate/latest", async (req: Request, res: Response) => {
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

  app.get("/migrate/seed", async (req: Request, res: Response) => {
    console.log("-------- MIGRATE SEED ---------")
    return seedUp()
      .then((result) => {
        return res.json(result)
      })
      .catch((error) => {
        res.status(422).json({ message: `Failed to seed: ${error}` })
      })
  })
}
