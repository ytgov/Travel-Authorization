import axios from "axios"
import { isEmpty } from "lodash"

import { AZURE_KEY } from "@/config"
import { User } from "@/models"

import BaseService from "@/services/base-service"

const YG_EMPLOYEE_DIRECTORY_API_URL = "https://api.gov.yk.ca/directory/employees"

export class YkGovernmentDirectorySyncService extends BaseService {
  private user: User

  constructor(user: User) {
    super()
    this.user = user
  }

  async perform(): Promise<User> {
    const email = this.user.email

    return axios
      .get(`${YG_EMPLOYEE_DIRECTORY_API_URL}`, {
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_KEY,
        },
        params: {
          email,
        },
      })
      .then(async ({ data }) => {
        if (isEmpty(data.employees)) {
          console.log(
            `Failed to find any employee info at ${YG_EMPLOYEE_DIRECTORY_API_URL} with email=${email}`
          )
          await this.user.update({
            lastEmployeeDirectorySyncAt: new Date(),
          })

          return this.user
        }

        const unitSearch = data.employees[0]

        await this.user.update({
          department: unitSearch.department,
          division: unitSearch.division,
          branch: unitSearch.branch,
          unit: unitSearch.unit,
          mailcode: unitSearch.mailcode,
          manager: unitSearch.manager,
          lastEmployeeDirectorySyncAt: new Date(),
        })

        return this.user
      })
      .catch((error) => {
        console.log(
          `Failed to access employee directory at ${YG_EMPLOYEE_DIRECTORY_API_URL} with email=${email}: ${error}`
        )
        return this.user
      })
  }
}

export default YkGovernmentDirectorySyncService
