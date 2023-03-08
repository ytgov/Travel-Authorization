import knex, { Knex } from "knex";
import { DB_CONFIG } from "../config";
import _, { map } from "lodash";
import axios from "axios";
import { timeStamp } from "console";
export class AuditService {
  private db: Knex;

  constructor() {
    this.db = knex(DB_CONFIG);
  }

  async log(userId: number, taid: number, action: string, note?: string): Promise<any | undefined> {
    try {
      let timestamp = new Date();
      await this.db("auditHistory").insert({
        userId,
        taid,
        action,
        note,
        timestamp
      });

      return true;
    } catch (error: any) {
      console.log(error);
    }
  }

  insertAudit(userId: number, taid: number, action: string, note?: string){
    
  }
}
