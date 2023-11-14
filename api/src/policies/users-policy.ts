import BasePolicy from "./base-policy"
import { User } from "@/models"

export class UsersPolicy extends BasePolicy<User> {
  show(): boolean {
    return true
  }

  create(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true

    return false
  }

  update(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true
    if (this.record.id === this.user.id) return true

    return false
  }

  destroy(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true

    return false
  }
}

export default UsersPolicy
