import { isNil } from "lodash"

import BaseController from "./base-controller"

import { User } from "@/models"
import { UsersPolicy } from "@/policies"
import { UsersSerializer } from "@/serializers"
import { CreateService } from "@/services/users"

export class UsersController extends BaseController {
  async create() {
    const user = await this.buildUser()
    const policy = this.buildPolicy(user)
    if (!policy.create()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to create this user." })
    }

    const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
    return CreateService.perform(permittedAttributes, this.currentUser)
      .then((user) => {
        return this.response.status(201).json({ user })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `User creation failed: ${error}` })
      })
  }

  async show() {
    const user = await this.loadUser()
    if (isNil(user)) return this.response.status(404).json({ message: "User not found." })

    const policy = this.buildPolicy(user)
    if (!policy.show()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to view this user." })
    }

    const serializedUser = UsersSerializer.asDetailed(user)
    return this.response.status(200).json({ user: serializedUser })
  }

  private async buildUser() {
    const attributes = this.request.body
    const user = User.build(attributes)
    return user
  }

  private loadUser(): Promise<User | null> {
    return User.findByPk(this.params.userId)
  }

  private buildPolicy(record: User): UsersPolicy {
    return new UsersPolicy(this.currentUser, record)
  }
}

export default UsersController
