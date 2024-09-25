import { DeepPartial } from "fishery"
import { faker } from "@faker-js/faker"

import { Expense, PerDiem, TravelSegment } from "@/models"
import BaseFactory from "@/factories/base-factory"
import { travelAuthorizationFactory } from "@/factories"
import { saveAndAssociateIfNew } from "@/factories/helpers"

class ExpenseFactory extends BaseFactory<Expense> {
  estimate(params: Pick<DeepPartial<Expense>, "expenseType">) {
    let description: string
    const expenseType = params.expenseType || faker.helpers.enumValue(Expense.ExpenseTypes)
    if (expenseType === Expense.ExpenseTypes.ACCOMMODATIONS) {
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
    try {
      await saveAndAssociateIfNew(expense, "travelAuthorization", { nested: true })

      return expense.save()
    } catch (error) {
      console.error(error)
      throw new Error(
        `Could not create Expense with attributes: ${JSON.stringify(expense.dataValues, null, 2)}`
      )
    }
  })

  const expense = Expense.build({
    type: faker.helpers.enumValue(Expense.Types),
    currency: "CAD",
    expenseType: faker.helpers.enumValue(Expense.ExpenseTypes),
    description: faker.lorem.sentence({ min: 3, max: 6 }),
    cost: parseFloat(faker.finance.amount({ min: 17.3, max: 500 })),
    date: faker.date.soon({ days: 30 }),
  })

  expense.travelAuthorization =
    associations.travelAuthorization ?? travelAuthorizationFactory.build()

  return expense
})

export default expenseFactory
