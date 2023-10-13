import { pick } from "lodash"

import { Expense, ExpenseTypes } from "@/models"

import BaseSerializer from "./base-serializer"

export class ExpensesSerializer extends BaseSerializer {
  static asTable(expenses: Expense[]) {
    return expenses.map((expense) => {
      return {
        ...pick(expense, ["id", "expenseType", "description", "date", "cost"]),
        actions: this.actions(expense),
      }
    })
  }

  // TODO: investigate whether these should depend on a policy check
  private static actions(expense: Expense): ("delete" | "edit")[] {
    if (expense.expenseType === ExpenseTypes.MEALS_AND_INCIDENTALS) {
      return ["delete"]
    } else {
      return ["edit", "delete"]
    }
  }
}

export default ExpensesSerializer
