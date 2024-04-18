import { isEmpty, isNil } from "lodash"

import { User } from "@/models"
import { yukonGovernmentIntegration } from "@/integrations"

import BaseService from "@/services/base-service"

export class YkGovernmentDirectorySyncService extends BaseService {
  private user: User

  constructor(user: User) {
    super()
    this.user = user
  }

  async perform(): Promise<User> {
    const email = this.user.email

    try {
      const employee = await yukonGovernmentIntegration.fetchEmpolyee(email)
      if (isNil(employee)) {
        console.log(`Failed to find any employee info for email=${email}`)
        return this.user
      }

      return this.user.update({
        department: employee.department,
        division: employee.division,
        branch: employee.branch,
        unit: employee.unit,
        mailcode: employee.mailcode,
        manager: employee.manager,
        lastEmployeeDirectorySyncAt: new Date(),
      })
    } catch (error) {
      return this.user
    }
  }
}

export default YkGovernmentDirectorySyncService
