import BasePolicy from "@/policies/base-policy"

import { Path } from "@/utils/deep-pick"
import { User, TravelAuthorization } from "@/models"
import TravelAuthorizationsPolicy from "@/policies/travel-authorizations-policy"

export class SubmitPolicy extends BasePolicy<TravelAuthorization> {
  create(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true
    if (this.record.supervisorEmail === this.user.email) return true
    if (this.record.userId === this.user.id) return true

    return false
  }

  permittedAttributes(): Path[] {
    const policy = new TravelAuthorizationsPolicy(this.user, this.record)
    return policy.permittedAttributes()
  }
}

export default SubmitPolicy
