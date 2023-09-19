import { AuditService, FormService } from "../services"

import BaseController from "./base-controller"
import db from "../db/db-client"

// TODO: push this code back into services where it belongs
const auditService = new AuditService()

export class FormsController extends BaseController {
  index() {
    return db("forms")
      .where("userId", "=", this.currentUser.id)
      .then((forms) => {
        return this.response.json({ forms })
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
