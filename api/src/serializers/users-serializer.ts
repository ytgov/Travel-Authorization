import { User } from "@/models"

import BaseSerializer from "./base-serializer"

export class UsersSerializer extends BaseSerializer<User> {
  static asDetailed(user: User): Partial<User> & { displayName: string } {
    const serializer = new this(user)
    return serializer.asDetailed()
  }

  asDetailed(): Partial<User> & { displayName: string } {
    return {
      ...this.record.dataValues,
      displayName: `${this.record.firstName} ${this.record.lastName}`,
    }
  }
}

export default UsersSerializer
