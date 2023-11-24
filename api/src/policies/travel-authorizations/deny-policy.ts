import BasePolicy from "@/policies/base-policy"

import { User, TravelAuthorization } from "@/models"

export class DenyPolicy extends BasePolicy<TravelAuthorization> {
  create(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true
    if (this.record.supervisorEmail === this.user.email) return true

    return false
  }
}

export default DenyPolicy
