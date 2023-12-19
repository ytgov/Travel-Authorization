import path from "path"
import fs from "fs"
import Papa from "papaparse"

import { PerDiem } from "@/models"
import { ClaimTypes, CurrencyTypes, LocationTypes } from "@/models/per-diem"

export async function perDiemSeeds() {
  const fileName = path.resolve(__dirname, "./per-diem-seeds.csv")
  const fileContent = fs.readFileSync(fileName, "utf8")
  const { data } = Papa.parse<{
    location: LocationTypes
    claim: ClaimTypes
    amount: number
    currency: CurrencyTypes
  }>(fileContent, {
    header: true,
    skipEmptyLines: true,
  })

  await PerDiem.destroy({ where: {} })
  await PerDiem.bulkCreate(data)
}

export default perDiemSeeds
