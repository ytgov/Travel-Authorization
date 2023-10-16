import knex, { Knex } from "knex";
import { DB_CONFIG } from "../config";
import _, { map } from "lodash";
import axios from "axios";
import { timeStamp } from "console";
export class SecurityService {
  private db: Knex;

  constructor() {
    this.db = knex(DB_CONFIG);
  }

  async isAdmin(email: string): Promise<any | undefined> {
    try {      
      await this.db.transaction(async (trx: any) => {
        let user = await this.db("user").select("roles").where("email", "=", email).first().transacting(trx);

        if (user.find("Admin")) {
          return true;
        }
        return false;
      });
    } catch (error: any) {
      console.log(error);
    }
  }
}
