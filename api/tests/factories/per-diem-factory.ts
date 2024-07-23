import { Factory } from "fishery"
import { faker } from "@faker-js/faker/locale/en_CA"

import { PerDiem } from "@/models"

export const perDiemFactory = Factory.define<PerDiem>(({ onCreate }) => {
  onCreate((perDiem) => perDiem.save())

  return PerDiem.build({
    claimType: faker.helpers.enumValue(PerDiem.ClaimTypes),
    travelRegion: faker.helpers.enumValue(PerDiem.TravelRegions),
    amount: parseFloat(faker.finance.amount({ min: 50, max: 200 })),
    currency: faker.helpers.enumValue(PerDiem.CurrencyTypes),
  })
})

export default perDiemFactory
