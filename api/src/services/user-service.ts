import axios from "axios"
import { isEmpty, split } from "lodash"

import { AZURE_KEY } from "@/config"
import dbLegacy from "@/db/db-client-legacy"

// TODO: replace this service with:
// a) a government directory api
// b) a user serializer
// c) a database state helper utility
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

  async makeDTO(userRaw: any) {
    let dto = userRaw
    dto.displayName = `${userRaw.firstName} ${userRaw.lastName}`
    dto.roles = split(userRaw.roles, ",").filter((r: string) => r.length > 0)
    dto.manage_mailcodes = split(userRaw.manage_mailcodes, ",").filter((r: string) => r.length > 0)
    //dto.display_access = _.join(dto.access.map((a: any) => a.level), ", ")

    return dto
  }

  isConnected(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      dbLegacy
        .raw("SELECT 'Connected' as [working]")
        .then((data: Array<any>) => {
          if (data && data.length == 1) {
            resolve(data[0].working === "Connected")
          }

          resolve(false)
        })
        .catch((err: Error) => {
          console.error(err)
          resolve(false)
        })
    })
  }
}
