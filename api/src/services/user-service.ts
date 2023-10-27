import axios from "axios"
import { isEmpty } from "lodash"

import { AZURE_KEY } from "@/config"

// TODO: replace this service with a government directory api
export class UserService {
  async getUnit(email: string) {
    let unitSearch = await axios
      .get(`https://api.gov.yk.ca/directory/employees?email=${email}`, {
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_KEY,
        },
      })
      .then(({ data }) => {
        if (isEmpty(data.employees)) return undefined

        return data.employees[0]
      })
      .catch((error) => {
        console.log(`Could not retrieve employee information for ${email}: ${error}`)
      })

    let unit = {
      department: "",
      division: "",
      branch: "",
      unit: "",
      mailcode: "",
      manager: "",
    }
    if (unitSearch) {
      unit = {
        department: unitSearch.department || "",
        division: unitSearch.division || "",
        branch: unitSearch.branch || "",
        unit: unitSearch.unit || "",
        mailcode: unitSearch.mailcode || "",
        manager: unitSearch.manager || "",
      }
    }
    return unit
  }
}
