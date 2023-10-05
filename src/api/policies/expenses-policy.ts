import { isNil } from "lodash"

import BasePolicy from "./base-policy"
import FormsPolicy from "./forms-policy"

import { Expense, User } from "../models"


export class ExpensesPolicy extends BasePolicy {
  static create(record: Expense, currentUser: User): boolean {
    const form = record.form
    if (isNil(form)) return false

    return FormsPolicy.update(form, currentUser)
  }
}

export default ExpensesPolicy
