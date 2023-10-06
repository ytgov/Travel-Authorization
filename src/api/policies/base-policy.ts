import { isNil, pick, upperFirst } from "lodash"

import { User } from "../models"

export type Actions = "create" | "update"

export class BasePolicy<Model> {
  protected user: User
  protected record: Model

  constructor(user: User, record: Model) {
    this.user = user
    this.record = record
  }

  create(): boolean {
    return false
  }

  update(): boolean {
    return false
  }

  permitAttributes(): Partial<Model> {
    return pick(this.record, this.permittedAttributes())
  }

  permitAttributesForCreate() {
    if (this.hasOwnProperty("permittedAttributesForCreate")) {
      return pick(this.record, this.permittedAttributesForCreate())
    } else {
      return pick(this.record, this.permittedAttributes())
    }
  }

  permitAttributesForUpdate() {
    if (this.hasOwnProperty("permittedAttributesForUpdate")) {
      return pick(this.record, this.permittedAttributesForUpdate())
    } else {
      return pick(this.record, this.permittedAttributes())
    }
  }

  permittedAttributes(): string[] {
    throw new Error("Not Implemented")
  }

  permittedAttributesForCreate(): string[] {
    throw new Error("Not Implemented")
  }

  permittedAttributesForUpdate(): string[] {
    throw new Error("Not Implemented")
  }
}

export default BasePolicy
