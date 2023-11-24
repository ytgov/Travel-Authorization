import { CreationAttributes } from "sequelize"
import { isNull } from "lodash"

import db from "@/db/db-client"

import { Expense } from "@/models"
import BaseService from "./base-service"

export class ExpensesService extends BaseService {
  static async create(attributes: Partial<Expense>): Promise<Expense> {
    // TODO: figure out typing for 'attributes' parameter
    return Expense.create(attributes as any)
  }

  // CONSIDER: When the update action is this simple, it might make more sense to make
  // an "active record" style model method, and use that directly instead.
  static async update(id: string | number, attributes: Partial<Expense>): Promise<Expense> {
    const expense = await Expense.findByPk(id)
    if (isNull(expense)) throw new Error("Could not find expense")

    return expense.update(attributes)
  }

  static destroy(id: string | number): Promise<void> {
    return Expense.destroy({ where: { id } }).then((rowsDeleted) => {
      if (rowsDeleted === 0) throw new Error("Could not delete expense")

      return
    })
  }

  static async bulkCreate(
    travelAuthorizationId: number,
    expenses: CreationAttributes<Expense>[]
  ): Promise<Expense[]> {
    if (!expenses.every((expense) => expense.travelAuthorizationId === travelAuthorizationId)) {
      throw new Error("All expenses must belong to the same form.")
    }

    return Expense.bulkCreate(expenses)
  }

  static async bulkReplace(
    travelAuthorizationId: number,
    expenses: CreationAttributes<Expense>[]
  ): Promise<Expense[]> {
    if (!expenses.every((expense) => expense.travelAuthorizationId === travelAuthorizationId)) {
      throw new Error("All expenses must belong to the same form.")
    }

    return db.transaction(async () => {
      await Expense.destroy({ where: { travelAuthorizationId } })
      return Expense.bulkCreate(expenses)
    })
  }
}

export default ExpensesService
