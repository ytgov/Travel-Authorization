import db from "../db/db-client"

import BaseModel from "./base-model"

// TODO: replace this with a boolean of isEstimate or
// move estimates to there own table.
// It's also possible that this is a single table inheritance model,
// and there should be two models, one for each "type".
export enum ExpenseTypes {
  ESTIMATE = "Estimates",
  EXPENSE = "Expenses"
}

export class Expense extends BaseModel {
  id: number
  taid: number
  description: string
  date: Date | null
  cost: number
  currency: string
  type: string
  receiptImage: Buffer | null
  fileSize: number | null
  fileName: string | null

  constructor(attributes: Pick<Expense, "id" | "taid" | "description" | "cost" | "currency" | "type"> & Partial<Expense>) {
    super()
    this.id = attributes.id
    this.taid = attributes.taid
    this.description = attributes.description
    this.date = attributes.date || null
    this.cost = attributes.cost
    this.currency = attributes.currency
    this.type = attributes.type
    this.receiptImage = attributes.receiptImage || null
    this.fileSize = attributes.fileSize || null
    this.fileName = attributes.fileName || null
  }

  static async findAll({
    where = {},
    include = [],
    limit = 1000,
    offset = 0,
  }: {
    where?: {}
    include?: string[]
    limit?: number
    offset?: number
  } = {}): Promise<Expense[]> {
    const expenses = await db("expenses").where(where).limit(limit).offset(offset)
    return expenses
  }
}

export default Expense
