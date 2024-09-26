import fs from "fs"

import { camelCase, isNil } from "lodash"
import { Knex } from "knex"
import Papa from "papaparse"

import { APP_ROOT } from "@/config"
import { PerDiem } from "@/models"
import { ClaimTypes, CurrencyTypes, TravelRegions } from "@/models/per-diem"

export async function seed(_knex: Knex): Promise<void> {
  const fileName = `${APP_ROOT}/db/seeds/data/per-diems.csv`
  const fileContent = fs.readFileSync(fileName, "utf8")
  const { data: perDiemsAttributes } = Papa.parse<{
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

  for (const perDiemAttributes of perDiemsAttributes) {
    const perDiem = await PerDiem.findOne({
      where: {
        travelRegion: perDiemAttributes.travelRegion,
        claimType: perDiemAttributes.claimType,
        currency: perDiemAttributes.currency,
      },
    })
    if (isNil(perDiem)) {
      await PerDiem.create(perDiemAttributes)
    } else {
      await perDiem.update(perDiemAttributes)
    }
  }
}
