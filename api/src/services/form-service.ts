import { isEmpty, map } from "lodash"

import dbLegacy from "@/db/db-client-legacy"
import { Expense } from "@/models"
import ExpensesService from "./expenses-service"

export class FormService {
  //returns form
  async getForm(formId: string): Promise<any | undefined> {
    console.warn(
      "This method is deprecated, and will be removed in a future version. Please use Form.findByPK instead, see FormsController#show"
    )
    try {
      let form: any = await dbLegacy("forms").select("*").first().where({ formId: formId })

      if (isEmpty(form)) {
        return undefined
      }

      let expenses = await this.getExpenses(form.id)
      let estimates = await this.getEstimates(form.id)
      let stops = await this.getStops(form.id)
      let departureDate = await dbLegacy("stops")
        .select("departureDate")
        .first()
        .where({ taid: form.id })
        .orderBy("departureDate", "asc")

      form.stops = stops
      form.estimates = estimates
      form.expenses = expenses
      form.departureDate = departureDate

      return form
    } catch (error: any) {
      console.log(error)
      return undefined
    }
  }

  async saveForm(userId: number, form: any): Promise<any | undefined> {
    console.warn(
      "This method is deprecated, and will be removed in a future version. Please use FormsService#update instead."
    )
    try {
      let stops = form.stops
      let expenses = form.expenses
      let estimates = form.estimates

      delete form.stops
      delete form.expenses
      delete form.estimates
      delete form.departureDate

      form.userId = userId
      form.status = "Draft"

      console.log(form)

      let returnedForm = await dbLegacy("forms").insert(form, "id").onConflict("formId").merge()
      let id = returnedForm[0].id

      await this.saveStops(id, stops)
      await this.saveExpenses(id, expenses)
      await this.saveEstimates(id, estimates)

      return true
    } catch (error: any) {
      console.log(error)
      return false
    }
  }

  async getStops(taid: number): Promise<any[] | undefined> {
    try {
      let stops = await dbLegacy("stops")
        .select("*")
        .where({ taid: taid })
        .orderBy("departureDate", "asc")
      return stops
    } catch (error: any) {
      console.log(error)
      return undefined
    }
  }

  async saveStops(taid: number, stops: any): Promise<Boolean> {
    try {
      await dbLegacy("stops").delete().where({ taid: taid })

      if (stops) {
        stops = map(stops, (stop) => {
          stop.taid = taid
          stop.locationId = stop.locationId != "" ? stop.locationId : null
          return stop
        })
        await dbLegacy("stops").insert(stops)
      }
      return true
    } catch (error: any) {
      console.log(error)
      return false
    }
  }

  async getExpenses(taid: number): Promise<any[] | undefined> {
    try {
      return Expense.findAll({
        where: {
          taid: taid,
          type: Expense.Types.EXPENSE,
        },
      })
    } catch (error: any) {
      console.log(error)
      return undefined
    }
  }

  async saveExpenses(taid: number, expenses: any): Promise<Boolean> {
    try {
      await ExpensesService.bulkReplace(taid, expenses)
      return true
    } catch (error: any) {
      console.log(error)
      return false
    }
  }

  async getEstimates(taid: number): Promise<any[] | undefined> {
    try {
      return Expense.findAll({
        where: {
          taid: taid,
          type: Expense.Types.ESTIMATE,
        },
      })
    } catch (error: any) {
      console.log(error)
      return undefined
    }
  }

  async saveEstimates(taid: number, estimates: any): Promise<Boolean> {
    console.warn("DEPRECATED: use saveEstimates instead.")
    return this.saveExpenses(taid, estimates)
  }

  async submitForm(userId: number, form: any): Promise<Boolean> {
    console.warn(
      "This method is deprecated, and will be removed in a future version. Please use FormsService#create instead."
    )
    try {
      let stops = form.stops
      delete form.stops

      let expenses = form.expenses
      delete form.expenses

      let estimates = form.estimates
      delete form.estimates

      delete form.departureDate

      // This is where we would check if the form is valid
      if (true) {
        form.userId = userId
        form.status = "Submitted"

        let returnedForm = await dbLegacy("forms").insert(form, "id").onConflict("formId").merge()
        let id = returnedForm[0].id

        await this.saveStops(id, stops)
        await this.saveExpenses(id, expenses)
        await this.saveEstimates(id, estimates)
        return true
      } else {
        throw new Error("Form is missing required fields")
      }
    } catch (error: any) {
      console.log(error)
      return false
    }
  }
}

export default FormService
