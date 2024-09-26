import fs from "fs"

import { isNil } from "lodash"
import { Knex } from "knex"
import Papa from "papaparse"

import { APP_ROOT } from "@/config"
import { Location } from "@/models"

export async function seed(_knex: Knex): Promise<void> {
  const fileName = `${APP_ROOT}/db/seeds/data/locations.csv`
  const fileContent = fs.readFileSync(fileName, "utf8")
  const { data: locationsAttributes } = Papa.parse<{ province: string; city: string }>(
    fileContent,
    {
      header: true,
      skipEmptyLines: true,
    }
  )

  for (const locationAttributes of locationsAttributes) {
    const location = await Location.findOne({
      where: {
        province: locationAttributes.province,
        city: locationAttributes.city,
      },
    })
    if (isNil(location)) {
      await Location.create(locationAttributes)
    } else {
      await location.update(locationAttributes)
    }
  }
}
