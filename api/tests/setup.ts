import db from "@/models"

async function truncateAllTables() {
  try {
    await db.truncate({ cascade: true, restartIdentity: true })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

// Runs after all tests in a file are done
afterAll(async () => {
  await truncateAllTables()
})
