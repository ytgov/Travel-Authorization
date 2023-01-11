import knex, { Knex } from "knex";
import { DB_CONFIG } from "../config";
import _, { map } from "lodash";
import axios from "axios";
import { timeStamp } from "console";
export class FormService {
  private db: Knex;

  constructor() {
    this.db = knex(DB_CONFIG);
  }

  async getForm(id: string): Promise<any | undefined> {
    try {
      await this.db.transaction(async (trx: any) => {
        let form = await this.db("forms").select("*").first().transacting(trx);

        let expenses = await this.db("expenses")
          .select("*")
          .where("type", "=", "Expenses")
          .andWhere("taid", "=", form.id)
          .transacting(trx);

        let stops = await this.db("stops")
          .select("*")
          .where("taid", "=", form.id)
          .leftJoin("destinations", "stops.travelTo", "destinations.id")
          .orderBy("departureDate", "asc");
        let stopString = stops
          .map((stop: any) => {
            return stop.name;
          })
          .concat();

        let departureDate = await this.db("stops").min("departureDate").where("taid", "=", form.id);
        departureDate = departureDate[0].min;

        form.expenses = expenses;
        form.stops = stops;
        form.departureDate = departureDate;
        form.stopString = stopString;

        console.log(form);

        return form;
      });
    } catch (error: any) {
      console.log(error);
    }
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

  async saveDepartmentAccess(id: string, access: number[]) {
    await this.db("departmentassignments").where("userid", "=", id).del();
    if (access) {
      const fieldsToInsert = access.map(entry => ({
        userid: id,
        objectid: entry
      }));
      return this.db("departmentassignments").insert(fieldsToInsert);
    }
  }

  async getRoleAccess(id: string): Promise<number[]> {
    return this.db("roleassignments").where("userid", "=", id).select("*");
  }

  async saveRoleAccess(id: string, access: number[]) {
    await this.db("roleassignments").where("userid", "=", id).del();
    if (access) {
      const fieldsToInsert = access.map(entry => ({
        userid: id,
        roleid: entry
      }));
      return this.db("roleassignments").insert(fieldsToInsert);
    }
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
