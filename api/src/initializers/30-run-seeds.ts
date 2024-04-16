import knex from "@/db/db-client-legacy"
import { TravelAuthorization } from "@/models"

async function runSeeds(): Promise<void> {
  if (process.env.SKIP_SEEDING_UNLESS_EMPTY === "true") {
    const count = await TravelAuthorization.count()
    if (count > 0) {
      console.log("Skipping seeding as SKIP_SEEDING_UNLESS_EMPTY set, and data already seeded.")
      return
    }
  }

  return knex.seed
    .run()
    .then(() => {
      console.log("All seeds completed successfully.")
    })
    .catch((error) => {
      console.error("Error running seeds:", error)
      throw error
    })
}

export default runSeeds
