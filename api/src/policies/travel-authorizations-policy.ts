import BasePolicy from "./base-policy"

import { User, TravelAuthorization } from "@/models"

export class TravelAuthorizationsPolicy extends BasePolicy<TravelAuthorization> {
  create(): boolean {
    if (this.record.userId === this.user.id) return true

    return false
  }

  show(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true
    if (this.record.userId === this.user.id) return true

    return false
  }

  update(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true
    if (
      this.record.userId === this.user.id &&
      this.record.status === TravelAuthorization.Statuses.DRAFT
    ) {
      return true
    }

    return false
  }

  static scope(records: TravelAuthorization[], currentUser: User) {
    return records.filter((record) => {
      const policy = new this(currentUser, record)
      return policy.show()
    })
  }
}

export default TravelAuthorizationsPolicy
