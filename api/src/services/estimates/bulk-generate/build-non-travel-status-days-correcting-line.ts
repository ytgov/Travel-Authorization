import { CreationAttributes } from "sequelize"
import { sumBy } from "lodash"

import { Expense } from "@/models"

const HOTEL_ALLOWANCE_PER_NIGHT = 250

export function buildNonTravelStatusDaysCorrectingLine({
  estimates,
  daysOffTravelStatus,
  travelAuthorizationId,
  travelEndAt,
}: {
  estimates: CreationAttributes<Expense>[]
  daysOffTravelStatus: number
  travelAuthorizationId: number
  travelEndAt: Date
}): CreationAttributes<Expense> {
  const accommodationCostTotal = sumBy(estimates, (estimate) => {
    if (estimate.expenseType === Expense.ExpenseTypes.ACCOMODATIONS) {
      return estimate.cost
    }
    return 0
  })
  const perDiemCostTotal = sumBy(estimates, (estimate) => {
    if (estimate.expenseType === Expense.ExpenseTypes.MEALS_AND_INCIDENTALS) {
      return estimate.cost
    }
    return 0
  })

  const accommodationReduction = Math.min(
    accommodationCostTotal,
    daysOffTravelStatus * HOTEL_ALLOWANCE_PER_NIGHT
  )
  const perDiemReduction = Math.min(perDiemCostTotal, daysOffTravelStatus * 777)

  return {
    type: Expense.Types.ESTIMATE,
    expenseType: Expense.ExpenseTypes.NON_TRAVEL_STATUS,
    travelAuthorizationId,
    currency: "CAD",
    description: `${daysOffTravelStatus} day @ non-travel status per diem = -${perDiemCostTotal} and ${daysOffTravelStatus} day @ non-travel status accomodation = -${accommodationReduction}`,
    cost: -(accommodationReduction + perDiemReduction),
    date: travelEndAt,
  }
}

export default buildNonTravelStatusDaysCorrectingLine
