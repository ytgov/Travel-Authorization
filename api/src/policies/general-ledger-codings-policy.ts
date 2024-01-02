import { GeneralLedgerCoding, User } from "@/models"

import BasePolicy from "@/policies/base-policy"

export class GeneralLedgerCodingsPolicy extends BasePolicy<GeneralLedgerCoding> {
  private travelAuthorization: GeneralLedgerCoding["travelAuthorization"]

  constructor(user: User, record: GeneralLedgerCoding) {
    super(user, record)
    this.travelAuthorization = record.travelAuthorization
  }

  create(): boolean {
    if (this.user.roles.includes(User.Roles.ADMIN)) return true
    if (this.travelAuthorization?.supervisorEmail === this.user.email) return true
    if (this.travelAuthorization?.userId === this.user.id) return true

    return false
  }

  update(): boolean {
    return this.create()
  }

  destroy(): boolean {
    return this.create()
  }

  permittedAttributes(): string[] {
    return ["code", "amount"]
  }

  permittedAttributesForCreate(): string[] {
    return ["travelAuthorizationId", ...this.permittedAttributes()]
  }
}

export default GeneralLedgerCodingsPolicy
