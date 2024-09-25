import { Factory } from "fishery"
import { faker } from "@faker-js/faker/locale/en_CA"

import { PerDiem } from "@/models"

export const perDiemFactory = Factory.define<PerDiem>(({ onCreate, sequence }) => {
  onCreate((perDiem) => {
    try {
      return perDiem.save()
    } catch (error) {
      console.error(error)
      throw new Error(
        `Could not create PerDiem with attributes: ${JSON.stringify(perDiem.dataValues, null, 2)}`
      )
    }
  })

  return PerDiem.build({
    id: sequence,
    claimType: faker.helpers.enumValue(PerDiem.ClaimTypes),
    travelRegion: faker.helpers.enumValue(PerDiem.TravelRegions),
    amount: parseFloat(faker.finance.amount({ min: 50, max: 200 })),
    currency: faker.helpers.enumValue(PerDiem.CurrencyTypes),
  })
})

export default perDiemFactory
