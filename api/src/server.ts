import { API_PORT } from "@/config"
import app from "@/app"
import logger from "@/utils/logger"

app.listen(API_PORT, async () => {
  logger.info(`API listenting on port ${API_PORT}`)
})
