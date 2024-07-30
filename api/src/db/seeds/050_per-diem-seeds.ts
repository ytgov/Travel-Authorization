import fs from "fs"

import { camelCase } from "lodash"
import { Knex } from "knex"
import Papa from "papaparse"

import { APP_ROOT } from "@/config"
import { PerDiem } from "@/models"
import { ClaimTypes, CurrencyTypes, TravelRegions } from "@/models/per-diem"

export async function seed(_knex: Knex): Promise<void> {
  const fileName = `${APP_ROOT}/db/seeds/data/per-diems.csv`
  const fileContent = fs.readFileSync(fileName, "utf8")
  const { data } = Papa.parse<{
    travelRegion: TravelRegions
    claimType: ClaimTypes
    amount: number
    currency: CurrencyTypes
  }>(fileContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader(header, _index): string {
      return camelCase(header)
    },
  })

  await PerDiem.destroy({ where: {} })
  await PerDiem.bulkCreate(data)
}
