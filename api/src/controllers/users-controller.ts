import { isNil } from "lodash"

import BaseController from "./base-controller"

import { User } from "@/models"
import { UsersPolicy } from "@/policies"
import { UsersSerializer } from "@/serializers"

export class UsersController extends BaseController {
  async show() {
    const user = await this.loadUser()
    if (isNil(user)) return this.response.status(404).json({ message: "User not found." })

    const policy = this.buildPolicy(user)
    if (!policy.update()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to view this user." })
    }

    const serializedUser = UsersSerializer.asDetailed(user)
    return this.response.status(200).json({ user: serializedUser })
  }

  private loadUser(): Promise<User | null> {
    return User.findByPk(this.params.userId)
  }

  private buildPolicy(record: User): UsersPolicy {
    return new UsersPolicy(this.currentUser, record)
  }
}

export default UsersController
