import { pick } from "lodash"

import Form from "../models/form"

import BaseSerializer from "./base-serializer"

export class FormSerializer extends BaseSerializer {
  static asTable(forms: Form[]) {
    return forms.map((form) => {
      return {
        ...pick(form, ["id", "department", "branch", "status"]),
        purpose: form.purpose?.purpose,
      }
    })
  }
}

export default FormSerializer
