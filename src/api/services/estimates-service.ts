import db from "../db/db-client"

import { Expense } from "../models"
import BaseService from "./base-service"

export class ExpensesService extends BaseService {
  static async bulkCreate(formId: number, expenses: Expense[]): Promise<Expense[]> {
    if (!expenses.every((expense) => expense.taid === formId)) {
      throw new Error("All expenses must belong to the same form.")
    }

    return db("expenses").insert(expenses).returning("*")
  }

  static async bulkReplace(formId: number, expenses: Expense[]): Promise<Expense[]> {
    if (!expenses.every((expense) => expense.taid === formId)) {
      throw new Error("All expenses must belong to the same form.")
    }

    return db.transaction(async (transaction) => {
      await transaction("expenses").where("taid", formId).delete()
      return transaction("expenses").insert(expenses).returning("*")
    })
  }
}

export default ExpensesService
