import knex from "@/db/db-client-legacy"

async function runMigrations(): Promise<void> {
  return knex.migrate
    .list()
    .then(([_completedMigrations, pendingMigrations]: [string[], string[]]) => {
      if (pendingMigrations.length === 0) {
        console.log("No pending migrations.")
        return
      }

      return pendingMigrations.reduce((promise, migration) => {
        return promise.then(() => {
          console.log(`Running migration: ${migration}`)
          return knex.migrate.up()
        })
      }, Promise.resolve())
    })
    .then(() => {
      console.log("All migrations completed successfully.")
    })
    .catch((error) => {
      console.error("Error running migrations:", error)
    })
}

export default runMigrations
