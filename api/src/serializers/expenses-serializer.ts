import { pick } from "lodash"

import { Expense } from "@/models"

import BaseSerializer from "./base-serializer"

export class ExpensesSerializer extends BaseSerializer<Expense> {
  static asTable(expenses: Expense[]) {
    return expenses.map((expense) => {
      const serializer = new this(expense)
      return serializer.asTableRow()
    })
  }

  asTableRow() {
    return {
      ...pick(this.record, [
        "id",
        "expenseType",
        "description",
        "date",
        "cost",
        "fileSize",
        "fileName",
      ]),
      actions: this.actions(),
    }
  }

  // TODO: investigate whether these should depend on a policy check
  private actions(): ("delete" | "edit")[] {
    if (this.record.expenseType === Expense.ExpenseTypes.MEALS_AND_INCIDENTALS) {
      return ["delete"]
    } else {
      return ["edit", "delete"]
    }
  }
}

export default ExpensesSerializer
