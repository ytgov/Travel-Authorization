import path from "path"
import fs from "fs"
import Papa from "papaparse"

import { Location } from "@/models"

export async function seedUp() {
  const fileName = path.resolve(__dirname, "./locations-seeds.csv")
  const fileContent = fs.readFileSync(fileName, "utf8")
  const { data } = Papa.parse<{ province: string; city: string }>(fileContent, {
    header: true,
    skipEmptyLines: true,
  })

  await Location.destroy({ where: {} })
  await Location.bulkCreate(data)
}
