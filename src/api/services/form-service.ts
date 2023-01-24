import knex, { Knex } from "knex";
import { DB_CONFIG } from "../config";
import _, { map } from "lodash";
import { Form } from "../models/form";
export class FormService {
  private db: Knex;

  constructor() {
    this.db = knex(DB_CONFIG);
  }

  //returns form
  async getForm(formId: string): Promise<any | undefined> {
    try {
      let form: Form = await this.db("forms").select("*").first().where({ formId: formId });

      if (_.isEmpty(form)) {
        return undefined;
      }

      let expenses = await this.getExpenses(form.id);
      let estimates = await this.getEstimates(form.id);
      let stops = await this.getStops(form.id);
      let departureDate = await this.db("stops")
        .select("departureDate")
        .first()
        .where({ taid: form.id })
        .orderBy("departureDate", "asc");

      form.stops = stops;
      form.estimates = estimates;
      form.expenses = expenses;
      form.departureDate = departureDate;

      return form;
    } catch (error: any) {
      console.log(error);
      return undefined;
    }
  }

  async saveForm(userId: string, form: Form): Promise<any | undefined> {
    try {
      console.log(form);

      let stops = form.stops;
      let expenses = form.expenses;
      let estimates = form.estimates;

      delete form.stops;
      delete form.expenses;
      delete form.estimates;
      delete form.departureDate;

      form.userId = userId;

      let returnedForm = await this.db("forms").insert(form, "id").onConflict("formId").merge();
      let id = returnedForm[0].id;

      await this.saveStops(id, stops);
      await this.saveExpenses(id, expenses);
      await this.saveEstimates(id, estimates);
      return true;
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }

  async getStops(id: string): Promise<any[] | undefined> {
    try {
      let stops = await this.db("stops").select("*").where({ taid: id }).orderBy("departureDate", "asc");
      return stops;
    } catch (error: any) {
      console.log(error);
      return undefined;
    }
  }

  async saveStops(taid: string, stops: any): Promise<Boolean> {
    try {
      await this.db("stops").delete().where({ taid: taid });

      if (stops) {
        stops = map(stops, stop => {
          stop.taid = taid;
          stop.locationId = stop.locationId != "" ? stop.locationId : null;
          return stop;
        });
        console.log(stops);
        await this.db("stops").insert(stops);
      }
      return true;
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }

  async getExpenses(id: string): Promise<any[] | undefined> {
    try {
      let expenses = await this.db("expenses").select("*").where({ taid: id }).andWhere("type", "=", "Expenses");
      return expenses;
    } catch (error: any) {
      console.log(error);
      return undefined;
    }
  }

  async saveExpenses(taid: string, expenses: any): Promise<Boolean> {
    try {
      await this.db("expenses").delete().where({ taid: taid });
      if (expenses) {
        expenses = map(expenses, expense => {
          expense.taid = taid;
          return stop;
        });
        await this.db("expenses").insert(expenses);
      }
      return true;
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }

  async getEstimates(id: string): Promise<any[] | undefined> {
    try {
      let estimates = await this.db("expenses").select("*").where({ taid: id }).andWhere("type", "=", "Estimates");
      return estimates;
    } catch (error: any) {
      console.log(error);
      return undefined;
    }
  }

  async saveEstimates(taid: string, estimates: any): Promise<Boolean> {
    try {
      await this.db("expenses").delete().where({ taid: taid });
      if (estimates) {
        estimates = map(estimates, estimate => {
          estimate.taid = taid;
          return stop;
        });
        await this.db("expenses").insert(estimates);
      }
      return true;
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }

  async submitForm(form: Form): Promise<Boolean> {
    try {
      let stops = form.stops;
      delete form.stops;

      let expenses = form.expenses;
      delete form.expenses;

      let estimates = form.estimates;
      delete form.estimates;

      if (
        form.userId &&
        form.firstName &&
        form.lastName &&
        form.department &&
        form.division &&
        form.branch &&
        form.unit &&
        form.email &&
        form.mailcode &&
        form.travelDuration &&
        form.dateBackToWork &&
        form.purpose &&
        form.eventName &&
        form.summary &&
        form.supervisorEmail &&
        form.status &&
        form.formId
      ) {
        let id = await this.db("forms").insert(form, "id").onConflict("formId").merge();

        await this.db("stops").delete().where("taid", "=", id[0].id);
        await this.db("stops").insert(stops);

        await this.db("expenses").delete().where("taid", "=", id[0].id);
        await this.db("expenses").insert(expenses);

        await this.db("expenses").delete().where("taid", "=", id[0].id);
        await this.db("expenses").insert(estimates);

        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }
}
