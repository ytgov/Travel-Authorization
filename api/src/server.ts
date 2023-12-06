import { API_PORT } from "@/config"
import app from "@/app"

app.listen(API_PORT, async () => {
  console.log(`API listenting on port ${API_PORT}`)
})
