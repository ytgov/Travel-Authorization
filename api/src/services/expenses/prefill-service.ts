import { CreationAttributes } from "sequelize"

import { Expense, TravelSegment } from "@/models"
import BaseService from "@/services/base-service"

export class PrefillService extends BaseService {
  private travelAuthorizationId: number
  private estimates: Expense[]

  constructor(travelAuthorizationId: number, estimates: Expense[]) {
    super()
    this.travelAuthorizationId = travelAuthorizationId
    this.estimates = estimates
  }

  async perform(): Promise<Expense[]> {
    const expenses = this.buildExpenses()

    return Expense.bulkCreate(expenses)
  }

  // TODO: it might make sense to re-generate the meals and incidentals,
  // rather than cloning them from expenses as they might have been edited by the user.
  private buildExpenses(): CreationAttributes<Expense>[] {
    const expensableEstimates = this.estimates
      .filter(
        (estimate) =>
          estimate.expenseType !== Expense.ExpenseTypes.TRANSPORTATION &&
          // TODO: consider linking estimate with travel segment?
          !estimate.description.includes(TravelSegment.TravelMethods.AIRCRAFT)
      )

    const expensesAttributes = expensableEstimates.map((estimate) => {
      const expenseAttributes = {
        travelAuthorizationId: this.travelAuthorizationId,
        description: estimate.description,
        date: estimate.date,
        cost: estimate.cost,
        currency: estimate.currency,
        type: Expense.Types.EXPENSE,
        expenseType: estimate.expenseType,
      }
      return expenseAttributes
    })

    return expensesAttributes
  }
}

export default PrefillService
