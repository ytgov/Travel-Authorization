import knex, { Knex } from "knex";
import { DB_CONFIG } from "../config";
import _, { map } from "lodash";
import axios from "axios";
import { timeStamp } from "console";
export class UserService {
  private db: Knex;

  constructor() {
    this.db = knex(DB_CONFIG);
  }

  async create(
    sub: string,
    email: string,
    first_name: string,
    last_name: string,
    roles: string,
    status: string
  ): Promise<any> {
    let existing = await this.db("user")
      .where({
        email
      })
      .count("email as cnt");

    if (existing[0].cnt > 0) return undefined;

    let user = {
      sub,
      email,
      first_name,
      last_name,
      roles,
      status,
      create_date: new Date()
    };

    return await this.db("user").insert(user);
  }

  async update(email: string, item: any) {
    return this.db("user")
      .where({
        email
      })
      .update(item);
  }

  async getAll() {
    return this.db("user");
  }

  async getByEmail(email: string): Promise<any | undefined> {
    return this.db("user")
      .where({
        email
      })
      .first();
  }

  async getById(id: string): Promise<any | undefined> {
    return this.db("user")
      .where({
        id
      })
      .first();
  }

  async getBySub(sub: string): Promise<any> {
    return this.db("user")
      .where({
        sub
      })
      .first();
  }

  async getAccessFor(email: string): Promise<string[]> {
    return this.db("user")
      .where({
        email
      })
      .select("roles");
  }

  async setAccess(email: string, access: string[]) {
    return this.db("user")
      .where({
        email
      })
      .update({
        roles: access
      });
  }

  async getDepartmentAccess(id: string): Promise<number[]> {
    return this.db("departmentassignments").where("userid", "=", id).select("*");
  }

  async saveDepartmentAccess(id: string, department: string) {
    try {
      await this.db.transaction(async trx => {
        await this.db("user")
          .update({
            department: department
          })
          .where("id", id)
          .transacting(trx);
      });
    } catch (error: any) {
      console.log(error);
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
    return this.db("roleassignments").where("userid", "=", id).select("*");
  }

  async saveRoleAccess(id: string, roles: string[]) {
    try {
      await this.db.transaction(async trx => {
        await this.db("user")
          .update({
            roles: roles.join()
          })
          .where("id", id)
          .transacting(trx);
      });
    } catch (error: any) {
      console.log(error);
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
      .get(`http://directory-api-dev.ynet.gov.yk.ca/employees`)
      .then((resp: any) => {
        let match = resp.data.employees.filter((user: any) => {
          return user.email == email;
        });
        return match[0];
      })
      .catch((e: Error) => {
        console.log(e);
      });

    let unit = {
      department: "",
      division: "",
      branch: "",
      unit: "",
      mailcode: "",
      manager: ""
    };
    if (unitSearch) {
      unit = {
        department: unitSearch.department || "",
        division: unitSearch.division || "",
        branch: unitSearch.branch || "",
        unit: unitSearch.unit || "",
        mailcode: unitSearch.mailcode || "",
        manager: unitSearch.manager || ""
      };
    }
    return unit;
  }

  async makeDTO(userRaw: any) {
    let dto = userRaw;
    dto.display_name = `${userRaw.first_name} ${userRaw.last_name}`;
    dto.roles = _.split(userRaw.roles, ",").filter((r: string) => r.length > 0);
    dto.manage_mailcodes = _.split(userRaw.manage_mailcodes, ",").filter((r: string) => r.length > 0);
    //dto.access = await this.db.getAccessFor(userRaw.email);
    //dto.display_access = _.join(dto.access.map((a: any) => a.level), ", ")

    return dto;
  }

  isConnected(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db
        .raw("SELECT 'Connected' as [working]")
        .then((data: Array<any>) => {
          if (data && data.length == 1) {
            resolve(data[0].working === "Connected");
          }

          resolve(false);
        })
        .catch((err: Error) => {
          console.error(err);
          resolve(false);
        });
    });
  }
}
