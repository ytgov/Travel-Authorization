import { AuditService, FormService } from "../services"

import BaseController from "./base-controller"
import Form from "../models/form"
import FormSerializer from "../serializers/form-serializer"

// TODO: push this code back into services where it belongs
const auditService = new AuditService()

export class FormsController extends BaseController {
  index() {
    return Form.findAll({
      where: { userId: this.currentUser.id },
      include: ["stops", "purpose"],
      limit: this.pagination.limit,
      offset: this.pagination.offset,
    }).then((forms) => {
      const serializedForms = FormSerializer.asTable(forms)
      return this.response.json({ forms: serializedForms })
    })
  }

  create() {
    return FormService.create(this.request.body, this.currentUser)
      .then((form) => {
        // TODO: push the audit logging code back into services where it belongs
        auditService.log(this.currentUser.id, form.id, "Submit", "Form submitted successfully.")
        return this.response.status(201).json({ form })
      })
      .catch((error) => {
        // TODO: push the audit logging code back into services where it belongs
        auditService.log(this.currentUser.id, -1, "Submit", "Form did not submit successfully.")
        return this.response.status(422).json({ message: `Form submission failed: ${error}` })
      })
  }

  show() {
    return Form.findByPk(this.params.formId, { include: ["stops", "purpose"] })
      .then((form) => {
        const serializedForm = FormSerializer.asDetailed(form)
        return this.response.json({ form: serializedForm })
      })
      .catch((error) => {
        if (error.message.includes("not found")) {
          return this.response.status(404).json({ message: `Form not found: ${error}` })
        } else {
          return this.response.status(500).json({ message: `Internal server error: ${error}` })
        }
      })
  }
}

export default FormsController
