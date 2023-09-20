import BasePolicy from "./base-policy"

import User from "../models/user"

export class FormsPolicy extends BasePolicy {
  static update(record: { userId: number }, currentUser: User): boolean {
    if (currentUser.roles.includes("Admin")) return true

    return record.userId === currentUser.id
  }
}

export default FormsPolicy
