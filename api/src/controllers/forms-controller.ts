import { isNil } from "lodash"

import BaseController from "./base-controller"

import { AuditService, TravelAuthorizationsService } from "@/services"
import { TravelAuthorization } from "@/models"
import { TravelAuthorizationsSerializer } from "@/serializers"
import { TravelAuthorizationsPolicy } from "@/policies"

// TODO: push this code back into services where it belongs
const auditService = new AuditService()

export class FormsController extends BaseController {
  index() {
    const where = this.query.where as any // TODO: figure out typing for "where" parameter
    return TravelAuthorization.findAndCountAll({
      where,
      include: ["stops", "purpose"],
      limit: this.pagination.limit,
      offset: this.pagination.offset,
    }).then(({ rows: travelAuthorizations, count }) => {
      const scopedTravelAuthorizations = TravelAuthorizationsPolicy.scope(travelAuthorizations, this.currentUser)
      const serializedTravelAuthorizations = TravelAuthorizationsSerializer.asTable(scopedTravelAuthorizations)
      return this.response.json({ forms: serializedTravelAuthorizations, totalCount: count })
    })
  }

  create() {
    return TravelAuthorizationsService.create(this.request.body, this.currentUser)
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
    // TODO: make missing route params auto-404?
    if (isNil(this.params.formId)) {
      return this.response.status(404).json({ message: "Form not found." })
    }

    const form = await this.loadForm()
    if (isNil(form)) return this.response.status(404).json({ message: "Form not found." })

    const policy = this.buildPolicy(form)
    if (!policy.show()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to view this form." })
    }

    return TravelAuthorization.findByPk(this.params.formId, { include: ["expenses", "stops", "purpose"] }).then(
      (form) => {
        if (isNil(form)) {
          return this.response.status(404).json({ message: "Form not found." })
        }

        const serializedForm = TravelAuthorizationsSerializer.asDetailed(form)
        return this.response.json({ form: serializedForm })
      }
    )
  }

  async update() {
    // TODO: make missing route params auto-404?
    if (isNil(this.params.formId)) {
      return this.response.status(404).json({ message: "Form not found." })
    }

    const form = await this.loadForm()
    if (isNil(form)) return this.response.status(404).json({ message: "Form not found." })

    const policy = this.buildPolicy(form)
    if (!policy.update()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to update this form." })
    }

    return TravelAuthorizationsService.update(this.params.formId, this.request.body)
      .then((form) => {
        this.response.json({ form })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Form update failed: ${error}` })
      })
  }

  private loadForm(): Promise<TravelAuthorization | null> {
    return TravelAuthorization.findByPk(this.params.formId)
  }

  private buildPolicy(record: TravelAuthorization): TravelAuthorizationsPolicy {
    return new TravelAuthorizationsPolicy(this.currentUser, record)
  }
}

export default FormsController
