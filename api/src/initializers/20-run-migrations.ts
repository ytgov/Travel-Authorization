import knex from "@/db/db-client-legacy"

async function runMigrations(): Promise<void> {
  const [_completedMigrations, pendingMigrations]: [string[], string[]] = await knex.migrate.list()

  if (pendingMigrations.length === 0) {
    console.log("No pending migrations.")
    return
  }

  return pendingMigrations
    .reduce(async (previousMigration, migration) => {
      await previousMigration

      console.log(`Running migration: ${migration}`)
      return knex.migrate.up()
    }, Promise.resolve())
    .then(() => {
      console.log("All migrations completed successfully.")
    })
    .catch((error) => {
      console.error("Error running migrations:", error)
      throw error
    })
}

export default runMigrations
