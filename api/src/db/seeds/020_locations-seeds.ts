import fs from "fs"

import { Knex } from "knex"
import Papa from "papaparse"

import { APP_ROOT } from "@/config"
import { Location } from "@/models"

export async function seed(knex: Knex): Promise<void> {
  const fileName = `${APP_ROOT}/db/data/locations.csv`
  const fileContent = fs.readFileSync(fileName, "utf8")
  const { data } = Papa.parse<{ province: string; city: string }>(fileContent, {
    header: true,
    skipEmptyLines: true,
  })

  await Location.destroy({ where: {} })
  await Location.bulkCreate(data)
}
