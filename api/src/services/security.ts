import { Op } from "sequelize"

import { User } from "@/models"

export class SecurityService {
  async isAdmin(email: string): Promise<boolean> {
    return User.findOne({
      where: {
        email,
        roles: {
          [Op.contains]: [User.Roles.ADMIN]
        },
      },
    }).then((user) => user !== null)
  }
}
