import { isNil, isEmpty, isNull } from "lodash"
import { v4 as uuid } from "uuid"

import { Form, User } from "@/models"
import StopsService from "./stops-service"
import LegacyFormSerivce from "./form-service"
import ExpensesService from "./expenses-service"

export class FormsService {
  static async create(
    { stops = [], expenses, estimates, ...attributes }: Form,
    currentUser: User
  ): Promise<Form> {
    attributes.userId = currentUser.id
    // Not sure if this is correct, but I can't find anything that generates the formId elsewhere
    if (isNil(attributes.formId)) {
      attributes.formId = uuid()
    }

    const form = await Form.create(attributes).catch((error) => {
      throw new Error(`Could not create form: ${error}`)
    })

    // OPINION: It's not worth supporting layered transactions here,
    // though that would be the standard way of doing things.
    // If we are using an ORM such as Sequelize, it would then be worth doing.
    const formId = form.id
    if (!isEmpty(stops)) {
      stops.forEach(async (stop) => {
        stop.taid = formId
      })
      await StopsService.bulkCreate(formId, stops)
    }

    const instance = new LegacyFormSerivce()
    await instance.saveExpenses(formId, expenses)
    await instance.saveEstimates(formId, estimates)

    return form
  }

  static async update(
    id: string | number,
    { stops = [], expenses = [], ...attributes }: Partial<Form>
  ): Promise<Form> {
    // TODO: change the function signature, so that you can pass in a form instance.
    const form = await Form.findByPk(id)
    if (isNull(form)) {
      throw new Error(`Could not find form with id: ${id}`)
    }

    form.update(attributes).catch((error) => {
      throw new Error(`Could not update form: ${error}`)
    })

    // OPINION: It's not worth supporting layered transactions here,
    // though that would be the standard way of doing things.
    // If we are using an ORM such as Sequelize, it would then be worth doing.
    const formId = form.id
    if (!isEmpty(stops)) {
      form.stops = await StopsService.bulkReplace(formId, stops)
    }

    if (!isEmpty(expenses)) {
      form.expenses = await ExpensesService.bulkReplace(formId, expenses)
    }

    return form
  }
}

export default FormsService
