import BaseController from "./base-controller"

import { Expense } from "../models"

export class ExpensesController extends BaseController {
  index() {
    const where = this.query.where
    return Expense.findAll({
      where,
    }).then((expenses) => {
      return this.response.json({ expenses })
    })
  }
}

export default ExpensesController
