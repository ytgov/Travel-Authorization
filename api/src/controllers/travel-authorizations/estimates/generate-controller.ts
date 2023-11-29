import { isNil } from "lodash"

import BaseController from "@/controllers/base-controller"

import { Expense, TravelAuthorization } from "@/models"
import { ExpensesPolicy } from "@/policies"
import { BulkGenerateService } from "@/services/estimates"

export class GenerateController extends BaseController {
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
        .json({ message: "You are not authorized to create this expense." })
    }

    return BulkGenerateService.perform(travelAuthorization.id)
      .then((estimates) => {
        return this.response.status(201).json({
          estimates,
          message: "Generated estimates",
        })
      })
      .catch((error) => {
        return this.response.status(422).json({
          message: `Failed to generate estimate: ${error}`,
        })
      })
  }

  private async loadTravelAuthorization() {
    return TravelAuthorization.findByPk(this.params.travelAuthorizationId)
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

export default GenerateController
