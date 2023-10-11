import { isNil } from "lodash"

import BaseController from "./base-controller"

import { AuditService, FormsService } from "../services"
import { Form } from "../models"
import { FormsSerializer } from "../serializers"
import { FormsPolicy } from "../policies"

// TODO: push this code back into services where it belongs
const auditService = new AuditService()

export class FormsController extends BaseController {
  index() {
    const where = this.query.where as any // TODO: figure out typing for "where" parameter
    return Form.findAndCountAll({
      where,
      include: ["stops", "purpose"],
      limit: this.pagination.limit,
      offset: this.pagination.offset,
    }).then(({ rows: forms, count }) => {
      const scopedForms = FormsPolicy.scope(forms, this.currentUser)
      const serializedForms = FormsSerializer.asTable(scopedForms)
      return this.response.json({ forms: serializedForms, totalCount: count })
    })
  }

  create() {
    return FormsService.create(this.request.body, this.currentUser)
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

    const policy = this.buildPolicy(form)
    if (!policy.show()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to view this form." })
    }

    return Form.findByPk(this.params.formId, { include: ["expenses", "stops", "purpose"] }).then(
      (form) => {
        const serializedForm = FormsSerializer.asDetailed(form)
        return this.response.json({ form: serializedForm })
      }
    )
  }

  async update() {
    const form = await this.loadForm()
    if (isNil(form)) return this.response.status(404).json({ message: "Form not found." })

    const policy = this.buildPolicy(form)
    if (!policy.update()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to update this form." })
    }

    return FormsService.update(this.params.formId, this.request.body)
      .then((form) => {
        this.response.json({ form })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Form update failed: ${error}` })
      })
  }

  private loadForm(): Promise<Form | undefined> {
    return Form.findByPk(this.params.formId)
  }

  private buildPolicy(record: Form): FormsPolicy {
    return new FormsPolicy(this.currentUser, record)
  }
}

export default FormsController
