import { faker } from "@faker-js/faker"

import { expenseFactory } from "@/factories"
import { Expense } from "@/models"

import { buildNonTravelStatusDaysCorrectingLine } from "@/services/estimates/bulk-generate"

describe("api/src/services/estimates/bulk-generate/build-non-travel-status-days-correcting-line.ts", () => {
  describe("buildNonTravelStatusDaysCorrectingLine", () => {
    test("when given some estimates and daysOffTravelStatus, it returns an array of correcting lines", () => {
      // Arrange
      const accommodation = expenseFactory
        .estimate({ expenseType: Expense.ExpenseTypes.ACCOMODATIONS })
        .build()
      const mealsAndIncidentals = expenseFactory
        .estimate({ expenseType: Expense.ExpenseTypes.MEALS_AND_INCIDENTALS })
        .build()
      const transportation = expenseFactory
        .estimate({ expenseType: Expense.ExpenseTypes.TRANSPORTATION })
        .build()
      const estimates = [
        accommodation.dataValues,
        mealsAndIncidentals.dataValues,
        transportation.dataValues,
      ]
      const daysOffTravelStatus = 1
      const travelAuthorizationId = faker.number.int({ min: 1, max: 1000 })
      const travelEndAt = faker.date.soon({ days: 30 })

      // Act
      const result = buildNonTravelStatusDaysCorrectingLine({
        estimates,
        daysOffTravelStatus,
        travelAuthorizationId,
        travelEndAt,
      })

      // Assert
      // "2 days @ non-travel status per diem = -230" and "2 days @ non-travel status accomodation = -500"
      expect(result).toEqual(
        {
          type: Expense.Types.ESTIMATE,
          expenseType: Expense.ExpenseTypes.NON_TRAVEL_STATUS,
          travelAuthorizationId,
          currency: "CAD",
          cost: -(accommodation.cost + mealsAndIncidentals.cost),
          description: `1 day @ non-travel status per diem = -${mealsAndIncidentals.cost} and 1 day @ non-travel status accomodation = -${accommodation.cost}`,
          date: travelEndAt,
        },
      )
    })
  })
})
