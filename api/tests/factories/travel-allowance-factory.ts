import { Factory } from "fishery"
import { faker } from "@faker-js/faker/locale/en_CA"

import { TravelAllowance } from "@/models"

export const travelAllowanceFactory = Factory.define<TravelAllowance>(({ onCreate }) => {
  onCreate((travelAllowance) => travelAllowance.save())

  const allowanceType = faker.helpers.enumValue(TravelAllowance.AllowanceTypes)
  let amount = 0
  switch (allowanceType) {
    case TravelAllowance.AllowanceTypes.MAXIUM_AIRCRAFT_ALLOWANCE:
      amount = parseFloat(faker.finance.amount({ min: 900, max: 1100, dec: 0 }))
      break
    case TravelAllowance.AllowanceTypes.AIRCRAFT_ALLOWANCE_PER_SEGMENT:
      amount = parseFloat(faker.finance.amount({ min: 300, max: 400, dec: 0 }))
      break
    case TravelAllowance.AllowanceTypes.DISTANCE_ALLOWANCE_PER_KILOMETER:
      amount = parseFloat(faker.finance.amount({ min: 0.5, max: 0.7, dec: 3 }))
      break
    case TravelAllowance.AllowanceTypes.HOTEL_ALLOWANCE_PER_NIGHT:
      amount = parseFloat(faker.finance.amount({ min: 200, max: 400, dec: 0 }))
      break
  }

  return TravelAllowance.build({
    allowanceType,
    amount,
    currency: faker.helpers.enumValue(TravelAllowance.CurrencyTypes),
  })
})

export default travelAllowanceFactory
