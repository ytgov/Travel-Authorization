import { DB_CONFIG } from "../config";
import knex from "knex";

export * from "./migrator";
/*
console.log("USING DATABASE AT", SQLITE_FILENAME);

 export const db = knex.knex({
  client: 'sqlite3',
  connection: () => ({
    filename: SQLITE_FILENAME
  })
}); */

export const sqldb = knex(DB_CONFIG);
