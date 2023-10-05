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

    const permittedAttributes = this.permittedAttributesFor("create")
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
    if (!ExpensesPolicy.update(expense, this.currentUser)) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to update this expense." })
    }

    const permittedAttributes = this.permittedAttributesFor("update")
    return ExpensesService.update(this.params.expenseId, permittedAttributes)
      .then((expense) => {
        this.response.json({ expense })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Expense update failed: ${error}` })
      })
  }

  private async buildExpense() {
    const attributes = this.request.body
    const { taid: formId } = attributes
    const form = await Form.findByPk(formId)
    return new Expense({ ...attributes, form })
  }

  // TODO: refactor this to the base controller somehow ...
  // Might need to set the policy class per-controller?
  private permittedAttributesFor(action: "create" | "update"): Partial<Expense> {
    if (action === "create") {
      return ExpensesPolicy.permitAttributesForCreate(this.request.body)
    } else if (action === "update") {
      return ExpensesPolicy.permitAttributesForUpdate(this.request.body)
    } else {
      return {}
    }
  }
}

export default ExpensesController
