import { AuditService, FormService } from "../services";

import BaseController from "./base-controller";

// TODO: push this code back into services where it belongs
const formService = new FormService();
const auditService = new AuditService();

export class FormsController extends BaseController {
  create() {
    return formService
      .submitForm(this.currentUser.id, this.request.body)
      .then((form) => {
        // TODO: push the audit logging code back into services where it belongs
        auditService.log(this.currentUser.id, form.id, "Submit", "Form submitted successfully.");
        return this.response.status(201).json({ form });
      })
      .catch((error) => {
        // TODO: push the audit logging code back into services where it belongs
        auditService.log(this.currentUser.id, -1, "Submit", "Form did not submit successfully.");
        return this.response.status(422).json({ message: "Form submission failed" });
      });
  }
}

export default FormsController;
