import BaseController from "../../base-controller"

import { Expense, Form } from "../../../models"
import { ExpensesPolicy } from "../../../policies"

export class GenerateController extends BaseController {
  async create() {
    const expense = await this.buildExpense()
    const policy = this.buildPolicy(expense)
    if (!policy.create()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to create this expense." })
    }

    return this.response.status(201).json({
      message: "TODO: generate estimates",
    })
  }

  private async buildExpense() {
    const attributes = this.request.body
    const { taid: formId } = attributes
    const form = await Form.findByPk(formId)
    return new Expense({ ...attributes, form })
  }

  private buildPolicy(record: Expense): ExpensesPolicy {
    return new ExpensesPolicy(this.currentUser, record)
  }
}

export default GenerateController
