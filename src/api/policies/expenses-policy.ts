import { isNil, pick } from "lodash"

import BasePolicy from "./base-policy"
import FormsPolicy from "./forms-policy"
import { Expense, User } from "../models"

export class ExpensesPolicy extends BasePolicy {
  static create(record: Expense, currentUser: User): boolean {
    const form = record.form
    if (isNil(form)) return false

    return FormsPolicy.update(form, currentUser)
  }

  static update(record: Expense, currentUser: User): boolean {
    return this.create(record, currentUser)
  }

  static permitAttributesForCreate(record: Partial<Expense>): Partial<Expense> {
    return pick(record, ["taid", "type", "currency", "description", "date", "cost", "expenseType"])
  }

  static permitAttributesForUpdate(record: Partial<Expense>): Partial<Expense> {
    return pick(record, ["description", "date", "cost", "expenseType"])
  }
}

export default ExpensesPolicy
