import { isUndefined } from "lodash"

import BasePolicy from "./base-policy"
import TravelAuthorizationsPolicy from "./travel-authorizations-policy"
import { Expense, TravelAuthorization, User } from "@/models"

export class ExpensesPolicy extends BasePolicy<Expense> {
  constructor(user: User, record: Expense) {
    super(user, record)
  }

  show(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true
    if (this.travelAuthorization.supervisorEmail === this.user.email) return true
    if (this.travelAuthorization.userId === this.user.id) return true

    return false
  }

  create(): boolean {
    if (this.record.type === Expense.Types.ESTIMATE) {
      if (this.travelAuthorizationPolicy?.update()) return true

      return false
    } else if (this.record.type === Expense.Types.EXPENSE) {
      if (this.user.roles.includes(User.Roles.ADMIN)) return true
      if (this.travelAuthorization.supervisorEmail === this.user.email) return true
      if (this.travelAuthorization.userId === this.user.id) return true

      return false
    } else {
      return false
    }
  }

  update(): boolean {
    return this.create()
  }

  destroy(): boolean {
    return this.create()
  }

  permittedAttributes(): string[] {
    return ["description", "date", "cost", "expenseType"]
  }

  permittedAttributesForCreate(): string[] {
    return ["travelAuthorizationId", "type", "currency", ...this.permittedAttributes()]
  }

  private get travelAuthorization(): TravelAuthorization {
    if (isUndefined(this.record.travelAuthorization)) {
      throw new Error("Travel Authorization association is required")
    }

    return this.record.travelAuthorization
  }

  private get travelAuthorizationPolicy(): TravelAuthorizationsPolicy | null {
    return new TravelAuthorizationsPolicy(this.user, this.travelAuthorization)
  }
}

export default ExpensesPolicy
