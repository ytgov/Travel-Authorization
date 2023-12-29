import BasePolicy from "@/policies/base-policy"

import { User, TravelAuthorization } from "@/models"

export class ExpenseClaimPolicy extends BasePolicy<TravelAuthorization> {
  // I'm not sure if the following logic should be in a policy or just the UI?
  // Submit becomes enabled with there are more than zero "Coding" rows,
  // and all expenses have an associated upload/receipt.
  create(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true
    if (this.record.supervisorEmail === this.user.email) return true
    if (this.record.userId === this.user.id) return true

    return false
  }
}

export default ExpenseClaimPolicy
