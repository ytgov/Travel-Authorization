import * as fs from "fs/promises"
import * as path from "path"

async function importAndExecuteInitializers() {
  const files = await fs.readdir(__dirname)

  for (const file of files) {
    if (/^index\.(ts|js)$/.test(file)) return

    const modulePath = path.join(__dirname, file)
    const { default: initializerAction } = await import(modulePath)
    console.log(`Running: ${modulePath}`)
    await initializerAction().catch((error: any) => {
      console.error(`Initialization error in ${modulePath}:`, error)
      process.exit(1)
    })
  }
}

importAndExecuteInitializers().then(() => process.exit(0))
