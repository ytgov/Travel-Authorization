import { isNil } from "lodash"

import BaseService from "@/services/base-service"
import { CreateService, type UserCreationAttributes } from "@/services/users/create-service"
import { User } from "@/models"

export class EnsureService extends BaseService {
  private attributes: UserCreationAttributes
  private currentUser: User

  constructor(attributes: UserCreationAttributes, currentUser: User) {
    super()
    this.attributes = attributes
    this.currentUser = currentUser
  }

  async perform(): Promise<User> {
    const { email } = this.attributes

    const user = await User.findOne({
      where: { email },
    })

    if (!isNil(user)) {
      return user
    }

    return CreateService.perform(this.attributes, this.currentUser).catch((error) => {
      throw new Error(`Failed to ensure user: ${error}`)
    })
  }
}

export default EnsureService
