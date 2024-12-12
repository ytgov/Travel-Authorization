import { pick } from "lodash"

import { Expense, User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type ExpenseShowView = Pick<
  Expense,
  | "id"
  | "travelAuthorizationId"
  | "description"
  | "date"
  | "cost"
  | "currency"
  | "type"
  | "fileSize"
  | "fileName"
  | "expenseType"
  | "createdAt"
  | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<Expense> {
  constructor(
    protected record: Expense,
    protected currentUser: User
  ) {
    super(record)
  }

  perform(): ExpenseShowView {
    return pick(this.record, [
      "id",
      "travelAuthorizationId",
      "description",
      "date",
      "cost",
      "currency",
      "type",
      "fileSize",
      "fileName",
      "expenseType",
      "createdAt",
      "updatedAt"
    ])
  }
}

export default ShowSerializer
