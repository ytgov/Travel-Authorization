import { Expense } from "@/models"
import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  // @ts-expect-error
  await Expense.update({ type: "Expense" }, { where: { type: "Expenses" } })
  // @ts-expect-error
  await Expense.update({ type: "Estimate" }, { where: { type: "Estimates" } })
}

export async function down(knex: Knex): Promise<void> {
  // @ts-expect-error
  await Expense.update({ type: "Expenses" }, { where: { type: "Expense" } })
  // @ts-expect-error
  await Expense.update({ type: "Estimates" }, { where: { type: "Estimate" } })
}
