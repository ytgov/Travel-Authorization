import { pick } from "lodash"

import Form from "../models/form"

export class FormSerializers {
  static asTable(forms: Form[]) {
    return forms.map((form) => {
      return {
        ...pick(form, ["id", "department", "branch", "status"]),
        purpose: form.purpose?.purpose,
      }
    })
  }
}

export default FormSerializers
