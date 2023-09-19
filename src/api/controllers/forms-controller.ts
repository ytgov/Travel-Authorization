import { AuditService, FormService } from "../services"

import BaseController from "./base-controller"
import Form from "../models/form"
import FormSerializers from "../serializers/form-serializers"

// TODO: push this code back into services where it belongs
const auditService = new AuditService()

export class FormsController extends BaseController {
  index() {
    return Form.findAll({
      where: { userId: this.currentUser.id },
      include: ["stops", "travelPurpose"],
    }).then((forms) => {
      const serializedForms = FormSerializers.asTable(forms)
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
}

export default FormsController
