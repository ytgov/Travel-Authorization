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
    if (!ExpensesPolicy.create(expense, this.currentUser)) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to create this expense." })
    }

    return ExpensesService.create(this.request.body)
      .then((expense) => {
        return this.response.status(201).json({ expense })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Expense creation failed: ${error}` })
      })
  }

  async update() {
    const expense = await this.buildExpense()
    if (!ExpensesPolicy.update(expense, this.currentUser)) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to update this expense." })
    }

    return ExpensesService.update(this.params.expenseId, this.request.body)
      .then((expense) => {
        this.response.json({ expense })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Form update failed: ${error}` })
      })
  }

  private async buildExpense() {
    const attributes = this.request.body
    const { taid: formId } = attributes
    const form = await Form.findByPk(formId)
    return new Expense({ ...attributes, form })
  }
}

export default ExpensesController
