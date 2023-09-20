import { isNil } from "lodash"

import db from "../db/db-client"
import BaseController from "./base-controller"

import { AuditService, FormService } from "../services"
import Form from "../models/form"
import FormSerializer from "../serializers/form-serializer"
import FormsPolicy from "../policies/FormsPolicy"

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
      const scopedForms = FormsPolicy.scope(forms, this.currentUser)
      const serializedForms = FormSerializer.asTable(scopedForms)
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

  async show() {
    const form = await this.loadForm()
    if (isNil(form)) return this.response.status(404).json({ message: "Form not found." })

    if (!FormsPolicy.update(form, this.currentUser)) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to view this form." })
    }

    return Form.findByPk(this.params.formId, { include: ["stops", "purpose"] }).then((form) => {
      const serializedForm = FormSerializer.asDetailed(form)
      return this.response.json({ form: serializedForm })
    })
  }

  async update() {
    const form = await this.loadForm()
    if (isNil(form)) return this.response.status(404).json({ message: "Form not found." })

    if (!FormsPolicy.update(form, this.currentUser)) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to update this form." })
    }

    return FormService.update(this.params.formId, this.request.body)
      .then((form) => {
        this.response.json({ form })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Form update failed: ${error}` })
      })
  }

  private loadForm(): Promise<Form | undefined> {
    return db<Form>("forms").where("id", this.params.formId).first()
  }
}

export default FormsController
