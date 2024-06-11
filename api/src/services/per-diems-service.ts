import knex, { Knex } from "knex";
import { DB_CONFIG } from "../config";
import logger from "@/utils/logger"

export class PerDiemsService {
  private db: Knex;

  constructor() {
    this.db = knex(DB_CONFIG);
  }

  async getPerDiems(): Promise<any | undefined> {
    try {
      let result = await this.db("perDiems").select("id", "claim", "location", "amount", "currency");
      return result;
    } catch (error: any) {
      logger.info(error);
      return [];
    }
  }

  async getPerDiem(id: number): Promise<any | undefined> {
    try {
      let result = await this.db("perDiems")
        .select("id", "claim", "location", "amount", "currency")
        .where("id", id)
        .first();
      return result;
    } catch (error: any) {
      logger.info(error);
      return [];
    }
  }

  async addPerDiem(claim: string, location: string, amount: number, currency: string): Promise<any | undefined> {
    try {
      let result = await this.db("perDiems").insert({
        claim: claim,
        location: location,
        amount: amount,
        currency: currency
      });
      return result;
    } catch (error: any) {
      logger.info(error);
      return [];
    }
  }

  async updatePerDiem(
    id: number,
    claim: string,
    location: string,
    amount: number,
    currency: string
  ): Promise<any | undefined> {
    try {
      let result = await this.db("perDiems")
        .update({
          claim: claim,
          location: location,
          amount: amount,
          currency: currency
        })
        .where("id", id);
      return result;
    } catch (error: any) {
      logger.info(error);
      return [];
    }
  }

  async deletePerDiem(id: number): Promise<any | undefined> {
    try {
      let result = await this.db("perDiems").delete().where("id", id);
      return result;
    } catch (error: any) {
      logger.info(error);
      return [];
    }
  }

  async getPerDiemByLocation(location: string): Promise<any | undefined> {
    try {
      let result = await this.db("perDiems")
        .select("id", "claim", "location", "amount", "currency")
        .where("location", location)
        .first();
      return result;
    } catch (error: any) {
      logger.info(error);
      return [];
    }
  }
}
