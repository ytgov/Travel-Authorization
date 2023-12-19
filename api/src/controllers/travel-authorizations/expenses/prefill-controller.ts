import { isNil } from "lodash"

import BaseController from "@/controllers/base-controller"

import { Expense, TravelAuthorization } from "@/models"
import { ExpensesPolicy } from "@/policies"
import { PrefillService } from "@/services/expenses"

export class PrefillController extends BaseController {
  async create() {
    const travelAuthorization = await this.loadTravelAuthorization()
    if (isNil(travelAuthorization)) {
      return this.response.status(404).json({ message: "Travel authorization not found." })
    }

    const expense = await this.buildExpense(travelAuthorization)
    const policy = this.buildPolicy(expense)
    if (!policy.create()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to prefill expenses." })
    }

    const estimates = travelAuthorization.estimates || []
    return PrefillService.perform(travelAuthorization.id, estimates)
      .then((estimates) => {
        return this.response.status(201).json({
          estimates,
          message: "Prefilled expenses",
        })
      })
      .catch((error) => {
        return this.response.status(422).json({
          message: `Failed to prefill expenses: ${error}`,
        })
      })
  }

  private async loadTravelAuthorization() {
    return TravelAuthorization.findByPk(this.params.travelAuthorizationId, {
      include: [
        {
          association: "expenses",
          where: {
            type: Expense.Types.ESTIMATE,
          },
        },
      ],
      order: [["expenses", "date", "ASC"]],
    })
  }

  private async buildExpense(travelAuthorization: TravelAuthorization) {
    const expense = Expense.build()
    expense.travelAuthorization = travelAuthorization
    return expense
  }

  private buildPolicy(record: Expense): ExpensesPolicy {
    return new ExpensesPolicy(this.currentUser, record)
  }
}

export default PrefillController
