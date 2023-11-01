import { User } from "@/models"

import BaseController from "@/controllers/base-controller"

export class BecomeAdminRoleController extends BaseController {
  async create() {
    return this.currentUser
      .update({ roles: [User.Roles.ADMIN] })
      .then(() => {
        return this.response.status(201).json({ message: "Admin Scenario Applied" })
      })
      .catch((error) => {
        return this.response
          .status(422)
          .json({ message: `Admin Scenario enactment failed: ${error}` })
      })
  }
}

export default BecomeAdminRoleController
