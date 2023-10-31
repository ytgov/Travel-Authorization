import { seedUp } from "@/data/seeds"

async function runSeeds(): Promise<void> {
  return seedUp()
    .then(() => {
      console.log("All seeds completed successfully.")
    })
    .catch((error) => {
      console.error("Error running seeds:", error)
      throw error
    })
}

export default runSeeds
