import { Express, Request, Response } from "express";
import { join } from "path";

import dbLegacy from "@/db/db-client-legacy"
import { seedUp } from "./seeds";

export async function migrateUp() {
  console.log("-------- MIGRATE UP ---------");
  return await dbLegacy.migrate.up({
    directory: join(__dirname, "migrations")
  });
}

export async function migrateDown() {
  console.log("-------- MIGRATE DOWN ---------");
  return await dbLegacy.migrate.down({
    directory: join(__dirname, "migrations")
  });
}

export async function migrateLatest() {
  console.log("-------- MIGRATE LATEST ---------");
  return await dbLegacy.migrate.latest({
    directory: join(__dirname, "migrations")
  });
}

export async function CreateMigrationRoutes(app: Express) {
  app.get("/migrate/up", async (req: Request, res: Response) => {
    res.send(await migrateUp());
  });

  app.get("/migrate/down", async (req: Request, res: Response) => {
    res.send(await migrateDown());
  });

  app.get("/migrate/latest", async (req: Request, res: Response) => {
    res.send(await migrateLatest());
  });

  app.get("/migrate/seed", async (req: Request, res: Response) => {
    res.send(await seedUp());
  });
}
