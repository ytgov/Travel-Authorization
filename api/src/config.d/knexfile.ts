import { Knex } from "knex"

import { DB_CONFIG } from "@/config"

const DEFAULT_CONFIG = {
  migrations: {
    schemaName: "public",
    tableName: "knex_migrations",
    // TODO: enable once https://github.com/knex/knex/pull/5422 gets merged
    // getNewMigrationName: (name) => {
    //   return `${someDateFormat(...)}-${name}.ts`;
    // }
    directory: "./../data/migrations",
  },
  seeds: {
    directory: "./../data/seeds",
  },
}

const config: { [key: string]: Knex.Config } = {
  development: {
    ...DEFAULT_CONFIG,
    ...DB_CONFIG,
  },
  staging: {
    ...DEFAULT_CONFIG,
    ...DB_CONFIG,
  },
  production: {
    ...DEFAULT_CONFIG,
    ...DB_CONFIG,
  },
}

export default config
