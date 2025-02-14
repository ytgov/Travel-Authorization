import { CreationAttributes } from "sequelize"
import { first, isEmpty, isNil } from "lodash"

import { Expense, TravelAuthorization, TravelSegment } from "@/models"
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
    const travelAuthorization = await TravelAuthorization.findByPk(this.travelAuthorizationId, {
      include: ["travelSegments"],
      order: [["travelSegments", "segmentNumber", "ASC"]],
    })
    if (isNil(travelAuthorization)) {
      throw new Error("Travel authorization not found.")
    }
    if (travelAuthorization.status !== TravelAuthorization.Statuses.APPROVED) {
      throw new Error("Travel authorization must be approved to prefill expenses.")
    }

    const { travelSegments } = travelAuthorization
    if (isNil(travelSegments) || isEmpty(travelSegments)) {
      throw new Error("Travel authorization must have travel segments to determine start date.")
    }
    if (!this.isAfterTravelStartDate(travelSegments)) {
      throw new Error("Must be after travel start date to prefill expenses.")
    }

    const expenses = this.buildExpenses()

    return Expense.bulkCreate(expenses)
  }

  // TODO: it might make sense to re-generate the meals and incidentals,
  // rather than cloning them from expenses as they might have been edited by the user.
  private buildExpenses(): CreationAttributes<Expense>[] {
    const expensableEstimates = this.estimates.filter(
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

  private isAfterTravelStartDate(travelSegments: TravelSegment[]): boolean {
    const firstTravelSegment = first(travelSegments)
    if (isNil(firstTravelSegment)) return false
    if (isNil(firstTravelSegment.departureOn)) return false

    return new Date(firstTravelSegment.departureOn) < new Date()
  }
}

export default PrefillService
