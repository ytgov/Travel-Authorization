import { Op } from "sequelize"

import { User } from "@/models"

export class SecurityService {
  async isAdmin(email: string): Promise<boolean> {
    return User.findOne({
      where: {
        email,
        roles: {
          // TODO: convert roles to a string array so using a regex is not necessary
          [Op.regexp]: "(^Admin,)|(,Admin,)|(,Admin$)",
        },
      },
    }).then((user) => user !== null)
  }
}
