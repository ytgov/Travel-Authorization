import { isNil } from "lodash"
import { Knex } from "knex"

import { TravelAllowance } from "@/models"

export async function seed(_knex: Knex): Promise<void> {
  const travelAllowancesAttributes = [
    {
      allowanceType: TravelAllowance.AllowanceTypes.MAXIUM_AIRCRAFT_ALLOWANCE,
      amount: 1000,
      currency: TravelAllowance.CurrencyTypes.CAD,
    },
    {
      allowanceType: TravelAllowance.AllowanceTypes.AIRCRAFT_ALLOWANCE_PER_SEGMENT,
      amount: 350,
      currency: TravelAllowance.CurrencyTypes.CAD,
    },
    {
      allowanceType: TravelAllowance.AllowanceTypes.DISTANCE_ALLOWANCE_PER_KILOMETER,
      amount: 0.605,
      currency: TravelAllowance.CurrencyTypes.CAD,
    },
    {
      allowanceType: TravelAllowance.AllowanceTypes.HOTEL_ALLOWANCE_PER_NIGHT,
      amount: 250,
      currency: TravelAllowance.CurrencyTypes.CAD,
    },
  ]
  for (const travelAllowanceAttributes of travelAllowancesAttributes) {
    const travelAllowance = await TravelAllowance.findOne({
      where: {
        allowanceType: travelAllowanceAttributes.allowanceType,
        currency: travelAllowanceAttributes.currency,
      },
    })
    if (!isNil(travelAllowance)) {
      await travelAllowance.update(travelAllowanceAttributes)
    } else {
      await TravelAllowance.create(travelAllowanceAttributes)
    }
  }
}
