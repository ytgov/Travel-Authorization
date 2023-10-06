import BasePolicy from "./base-policy"

import User from "../models/user"
import Form, { FormStatuses } from "../models/form"

export class FormsPolicy extends BasePolicy<Form> {
  show(): boolean {
    if (this.user.roles.includes("Admin")) return true

    return this.record.userId === this.user.id
  }

  update(): boolean {
    if (this.user.roles.includes("Admin")) return true
    if (this.record.userId !== this.user.id) return false

    return this.record.status === FormStatuses.DRAFT
  }

  static scope(records: Form[], currentUser: User) {
    return records.filter((record) => {
      const policy = new this(currentUser, record)
      return policy.show()
    })
  }
}

export default FormsPolicy
