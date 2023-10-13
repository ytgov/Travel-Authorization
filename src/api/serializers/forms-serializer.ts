import { isEmpty, isNil, minBy, pick } from "lodash"

import Form from "../models/form"

import BaseSerializer from "./base-serializer"

export class FormsSerializer extends BaseSerializer {
  static asTable(forms: Form[]) {
    return forms.map((form) => {
      return {
        ...pick(form, ["id", "department", "branch", "dateBackToWork", "status"]),
        purpose: form.purpose?.purpose,
        departingAt: this.departingAt(form),
      }
    })
  }

  static asDetailed(form: Form) {
    return form
  }

  private static departingAt(form: Form) {
    const stops = form.stops || []
    if (isEmpty(stops)) return "Unknown"

    const firstStop = minBy(stops, ({ departureDate, departureTime }) => {
      const departingAtString = `${departureDate}T${departureTime}`
      return new Date(departingAtString)
    })
    if (isNil(firstStop)) return "Unknown"

    const { departureDate, departureTime } = firstStop
    const departingAtString = `${departureDate}T${departureTime}`
    return new Date(departingAtString)
  }
}

export default FormsSerializer
