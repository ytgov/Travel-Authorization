import { isNil } from "lodash"
import db from "../db/db-client"

import BasePolicy from "./base-policy"
import User from "../models/user"

export class FormsPolicy extends BasePolicy {
  static update(recordId: string | number, currentUser: User): Promise<boolean> {
    if (currentUser.roles.includes("Admin")) return Promise.resolve(true)

    return db("forms")
      .where({ id: recordId, userId: currentUser.id })
      .first()
      .then((result) => !isNil(result))
  }
}

export default FormsPolicy
