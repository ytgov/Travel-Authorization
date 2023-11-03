import { User } from "@/models"

import BaseController from "@/controllers/base-controller"

export class BecomeUserRoleController extends BaseController {
  async create() {
    return this.currentUser
      .update({ roles: [User.Roles.USER] })
      .then(() => {
        return this.response.status(201).json({ message: "User Role Scenario Applied" })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `User Role Scenario enactment failed: ${error}` })
      })
  }
}

export default BecomeUserRoleController
