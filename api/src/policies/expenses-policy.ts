import { isNil } from "lodash"

import BasePolicy from "./base-policy"
import TravelAuthorizationsPolicy from "./travel-authorizations-policy"
import { Expense } from "@/models"

export class ExpensesPolicy extends BasePolicy<Expense> {
  create(): boolean {
    const travelAuthorization = this.record.travelAuthorization
    if (isNil(travelAuthorization)) return false

    const travelAuthorizationsPolicy = new TravelAuthorizationsPolicy(this.user, travelAuthorization)
    return travelAuthorizationsPolicy.update()
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
}

export default ExpensesPolicy
