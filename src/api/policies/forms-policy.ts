import BasePolicy from "./base-policy"

import User from "../models/user"
import Form, { FormStatuses } from "../models/form"

export class FormsPolicy extends BasePolicy<Form> {
  static show(record: Form, currentUser: User): boolean {
    if (currentUser.roles.includes("Admin")) return true

    return record.userId === currentUser.id
  }

  update(): boolean {
    if (this.user.roles.includes("Admin")) return true
    if (this.record.userId !== this.user.id) return false

    return this.record.status === FormStatuses.DRAFT
  }

  static scope(records: Form[], currentUser: User) {
    return records.filter((record) => this.show(record, currentUser))
  }
}

export default FormsPolicy
