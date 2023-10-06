import BaseController from "./base-controller"

import { Expense, Form } from "../models"
import { ExpensesService } from "../services"
import { ExpensesPolicy } from "../policies"

export class ExpensesController extends BaseController {
  index() {
    const where = this.query.where
    return Expense.findAll({
      where,
    }).then((expenses) => {
      return this.response.json({ expenses })
    })
  }

  async create() {
    const expense = await this.buildExpense()
    const policy = this.buildPolicy(expense)
    if (!policy.create()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to create this expense." })
    }

    const permittedAttributes = policy.permitAttributesForCreate()
    return ExpensesService.create(permittedAttributes)
      .then((expense) => {
        return this.response.status(201).json({ expense })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Expense creation failed: ${error}` })
      })
  }

  async update() {
    const expense = await this.buildExpense()
    const policy = this.buildPolicy(expense)
    if (!policy.update()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to update this expense." })
    }

    const permittedAttributes = policy.permitAttributesForUpdate()
    return ExpensesService.update(this.params.expenseId, permittedAttributes)
      .then((expense) => {
        this.response.json({ expense })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Expense update failed: ${error}` })
      })
  }

  private buildPolicy(record: Expense): ExpensesPolicy {
    return new ExpensesPolicy(this.currentUser, record)
  }

  private async buildExpense() {
    const attributes = this.request.body
    const { taid: formId } = attributes
    const form = await Form.findByPk(formId)
    return new Expense({ ...attributes, form })
  }
}

export default ExpensesController
