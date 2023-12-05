import { DeepPartial, Factory } from "fishery"
import { faker } from "@faker-js/faker"
import { isNil } from "lodash"

import { Expense, PerDiem, TravelSegment } from "@/models"
import { travelAuthorizationFactory } from "@/factories"

class ExpenseFactory extends Factory<Expense> {
  estimate(params: Pick<DeepPartial<Expense>, "expenseType">) {
    let description: string
    const expenseType = params.expenseType || faker.helpers.enumValue(Expense.ExpenseTypes)
    if (expenseType === Expense.ExpenseTypes.ACCOMODATIONS) {
      const accommodationType = faker.helpers.enumValue(TravelSegment.AccommodationTypes)
      const city = faker.location.city()
      description = `${accommodationType} in ${city}`
    } else if (expenseType === Expense.ExpenseTypes.MEALS_AND_INCIDENTALS) {
      const claims = faker.helpers.arrayElements(Object.values(PerDiem.ClaimTypes))
      description = claims.join("/")
    } else if (expenseType === Expense.ExpenseTypes.TRANSPORTATION) {
      const modeOfTransport = faker.helpers.enumValue(TravelSegment.TravelMethods)
      const departureCity = faker.location.city()
      const arrivalCity = faker.location.city()
      description = `${modeOfTransport} from ${departureCity} to ${arrivalCity}`
    } else {
      description = faker.lorem.sentence({ min: 3, max: 6 })
    }

    return this.params({
      type: Expense.Types.ESTIMATE,
      description,
      expenseType,
    })
  }
}

export const expenseFactory = ExpenseFactory.define(({ associations, onCreate }) => {
  onCreate(async (expense) => {
    if (isNil(expense.travelAuthorizationId)) {
      const travelAuthorization =
        associations.travelAuthorization || travelAuthorizationFactory.build()
      await travelAuthorization.save()
      expense.travelAuthorizationId = travelAuthorization.id
    }

    return expense.save()
  })

  return Expense.build({
    type: faker.helpers.enumValue(Expense.Types),
    currency: "CAD",
    expenseType: faker.helpers.enumValue(Expense.ExpenseTypes),
    description: faker.lorem.sentence({ min: 3, max: 6 }),
    cost: parseFloat(faker.finance.amount({ min: 17.3, max: 500 })),
    date: faker.date.soon({ days: 30 }),
  })
})

export default expenseFactory
