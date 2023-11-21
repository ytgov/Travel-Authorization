import { isNil } from "lodash"

import BaseController from "../base-controller"
import { User } from "@/models"
import { YkGovernmentDirectorySyncService } from "@/services"
import { UsersSerializer } from "@/serializers"
import { UsersPolicy } from "@/policies"

export class YgGovernmentDirectorySyncController extends BaseController {
  async create() {
    const user = await this.loadUser()
    if (isNil(user)) return this.response.status(404).json({ message: "User not found." })

    const policy = this.buildPolicy(user)
    if (!policy.update()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to sync this user." })
    }

    return YkGovernmentDirectorySyncService.perform(this.currentUser).then((user) => {
      const serializedUser = UsersSerializer.asDetailed(user)
      return this.response.status(200).json({ user: serializedUser })
    })
  }

  private loadUser(): Promise<User | null> {
    return User.findByPk(this.params.userId)
  }

  private buildPolicy(record: User): UsersPolicy {
    return new UsersPolicy(this.currentUser, record)
  }
}

export default YgGovernmentDirectorySyncController
