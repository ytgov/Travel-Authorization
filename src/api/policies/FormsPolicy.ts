import BasePolicy from "./base-policy"

import User from "../models/user"
import Form from "../models/form"

export class FormsPolicy extends BasePolicy {
  static show(record: Form, currentUser: User): boolean {
    if (currentUser.roles.includes("Admin")) return true

    return record.userId === currentUser.id
  }

  static update(record: Form, currentUser: User): boolean {
    if (currentUser.roles.includes("Admin")) return true

    return record.userId === currentUser.id
  }

  static scope(records: Form[], currentUser: User) {
    return records.filter(record => this.show(record, currentUser));
  }
}

export default FormsPolicy
