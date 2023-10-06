import { isNil } from "lodash"

import BasePolicy from "./base-policy"
import FormsPolicy from "./forms-policy"
import { Expense } from "../models"

export class ExpensesPolicy extends BasePolicy<Expense> {
  create(): boolean {
    const form = this.record.form
    if (isNil(form)) return false

    return FormsPolicy.update(form, this.user)
  }

  update(): boolean {
    return this.create()
  }

  permittedAttributes(): string[] {
    return ["description", "date", "cost", "expenseType"]
  }

  permittedAttributesForCreate(): string[] {
    return ["taid", "type", "currency", ...this.permittedAttributes()]
  }
}

export default ExpensesPolicy
