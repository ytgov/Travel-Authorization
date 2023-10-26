import knex from "@/db/db-client-legacy"

knex.migrate
  .list()
  .then(([_completedMigrations, pendingMigrations]: [string[], string[]]) => {
    if (pendingMigrations.length === 0) {
      console.log("No pending migrations.")
      process.exit(0)
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
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error running migrations:", error)
    process.exit(1)
  })
