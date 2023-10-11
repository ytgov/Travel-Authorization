import BaseController from "../../base-controller"

import { Expense, ExpenseTypes, Types as ExpenseVariants } from "../../../models"
import { ExpensesPolicy } from "../../../policies"
import { BulkGenerate } from "../../../services/estimates"

export class GenerateController extends BaseController {
  async create() {
    const expense = await this.buildExpense()
    const policy = this.buildPolicy(expense)
    if (!policy.create()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to create this expense." })
    }

    return BulkGenerate.perform(this.formId).then((estimates) => {
      return this.response.status(201).json({
        estimates,
        message: "Generated estimates",
      })
    })
  }

  private async buildExpense() {
    return Expense.build({
      taid: this.formId,
      type: ExpenseVariants.ESTIMATE,
      description: "NOT RELEVANT",
      cost: 0,
      currency: "CAD",
      expenseType: ExpenseTypes.TRANSPORTATION,
    })
  }

  private buildPolicy(record: Expense): ExpensesPolicy {
    return new ExpensesPolicy(this.currentUser, record)
  }

  private get formId() {
    return parseInt(this.params.formId.toString())
  }
}

export default GenerateController
