import knex, { Knex } from "knex"
import axios from "axios"
import { isEmpty, last, split } from "lodash"

import { AZURE_KEY, DB_CONFIG } from "@/config"
import { User } from "@/models"

export class UserService {
  private db: Knex

  constructor() {
    this.db = knex(DB_CONFIG)
  }

  async create(
    sub: string,
    email: string,
    first_name: string,
    last_name: string,
    roles: string,
    status: string
  ): Promise<any> {
    const existingUser = await User.findOne({ where: { email } })
    // TODO: rebuild this method to make it either an upsert or throw an error
    // if the user already exists
    if (existingUser !== null) return undefined

    return User.create({
      sub,
      email,
      firstName: first_name,
      lastName: last_name,
      roles,
      status,
    })
  }

  async getBySub(sub: string): Promise<any> {
    return this.db("user")
      .where({
        sub,
      })
      .first()
  }

  async getAccessFor(email: string): Promise<string[]> {
    return this.db("user")
      .where({
        email,
      })
      .select("roles")
  }

  async setAccess(email: string, access: string[]) {
    return this.db("user")
      .where({
        email,
      })
      .update({
        roles: access,
      })
  }

  async getDepartmentAccess(id: string): Promise<number[]> {
    return this.db("departmentassignments").where("userid", "=", id).select("*")
  }

  async saveDepartmentAccess(id: string, department: string) {
    try {
      await this.db.transaction(async (trx) => {
        await this.db("user")
          .update({
            department: department,
          })
          .where("id", id)
          .transacting(trx)
      })
    } catch (error: any) {
      console.log(error)
    }
    // await this.db('departmentassignments').where('userid', '=', id).del();
    // if (access) {
    // 	const fieldsToInsert = access.map((entry) => ({
    // 		userid: id,
    // 		objectid: entry,
    // 	}));
    // 	return this.db('departmentassignments').insert(fieldsToInsert);
    // }
  }

  async getRoleAccess(id: string): Promise<number[]> {
    return this.db("roleassignments").where("userid", "=", id).select("*")
  }

  async saveRoleAccess(id: string, roles: string[]) {
    try {
      await this.db.transaction(async (trx) => {
        await this.db("user")
          .update({
            roles: roles.join(),
          })
          .where("id", id)
          .transacting(trx)
      })
    } catch (error: any) {
      console.log(error)
    }
    // await this.db('roleassignments').where('userid', '=', id).del();
    // if (access) {
    //     const fieldsToInsert = access.map((entry) => ({
    //         userid: id,
    //         roleid: entry,
    //     }));
    //     return this.db('roleassignments').insert(fieldsToInsert);
    // }
  }

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
    dto.display_name = `${userRaw.first_name} ${userRaw.last_name}`
    dto.roles = split(userRaw.roles, ",").filter((r: string) => r.length > 0)
    dto.manage_mailcodes = split(userRaw.manage_mailcodes, ",").filter((r: string) => r.length > 0)
    //dto.access = await this.db.getAccessFor(userRaw.email);
    //dto.display_access = _.join(dto.access.map((a: any) => a.level), ", ")

    return dto
  }

  isConnected(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db
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
