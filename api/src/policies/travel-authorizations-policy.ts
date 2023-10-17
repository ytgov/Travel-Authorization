import BasePolicy from "./base-policy"

import { User, TravelAuthorization } from "@/models"

export class TravelAuthorizationsPolicy extends BasePolicy<TravelAuthorization> {
  show(): boolean {
    if (this.user.roles.includes("Admin")) return true

    return this.record.userId === this.user.id
  }

  update(): boolean {
    if (this.user.roles.includes("Admin")) return true
    if (this.record.userId !== this.user.id) return false

    return this.record.status === TravelAuthorization.Statuses.DRAFT
  }

  static scope(records: TravelAuthorization[], currentUser: User) {
    return records.filter((record) => {
      const policy = new this(currentUser, record)
      return policy.show()
    })
  }
}

export default TravelAuthorizationsPolicy
