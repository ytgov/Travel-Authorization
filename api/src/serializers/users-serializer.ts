import { pick } from "lodash"

import { User } from "@/models"
import BaseSerializer from "./base-serializer"

export class UsersSerializer extends BaseSerializer<User> {
  static asDetailed(user: User): Partial<User> & { displayName: string } {
    const serializer = new this(user)
    return serializer.asDetailed()
  }

  asDetailed(): Partial<User> & { displayName: string } {
    // Note that "sub" (Auth0 subject attribute) is a restricted field.
    return {
      ...pick(this.record.dataValues, [
        "id",
        "email",
        "status",
        "firstName",
        "lastName",
        "roles",
        "department",
        "division",
        "branch",
        "unit",
        "mailcode",
        "manager",
        "lastEmployeeDirectorySyncAt",
        "createdAt",
        "updatedAt",
      ]),
      displayName: `${this.record.firstName} ${this.record.lastName}`,
    }
  }
}

export default UsersSerializer
