import fs from "fs"

import { isNil } from "lodash"
import { Knex } from "knex"
import Papa from "papaparse"

import { APP_ROOT } from "@/config"

export async function seed(knex: Knex): Promise<void> {
  const fileName = `${APP_ROOT}/db/seeds/data/distance-matrix.csv`
  const fileContent = fs.readFileSync(fileName, "utf8")
  const { data: distanceMatrixsAttributes } = Papa.parse<{
    origin: string
    destination: string
    kilometers: number
  }>(fileContent, {
    header: true,
    skipEmptyLines: true,
  })

  for (const distanceMatrixAttributes of distanceMatrixsAttributes) {
    const distanceMatrix = await knex("distanceMatrix")
      .where({
        origin: distanceMatrixAttributes.origin,
        destination: distanceMatrixAttributes.destination,
      })
      .first()
    if (isNil(distanceMatrix)) {
      await knex("distanceMatrix").insert(distanceMatrixAttributes)
    } else {
      await knex("distanceMatrix")
        .where({
          origin: distanceMatrixAttributes.origin,
          destination: distanceMatrixAttributes.destination,
        })
        .update(distanceMatrixAttributes)
    }
  }
}
