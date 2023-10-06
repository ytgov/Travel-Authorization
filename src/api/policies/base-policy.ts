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
    return pick(this.record, this.permitedAttributes())
  }

  permitAttributesForCreate() {
    if (this.hasOwnProperty("permitedAttributesForCreate")) {
      return pick(this.record, this.permitedAttributesForCreate())
    } else {
      return pick(this.record, this.permitedAttributes())
    }
  }

  permitAttributesForUpdate() {
    if (this.hasOwnProperty("permitedAttributesForUpdate")) {
      return pick(this.record, this.permitedAttributesForUpdate())
    } else {
      return pick(this.record, this.permitedAttributes())
    }
  }

  permitedAttributes(): string[] {
    throw new Error("Not Implemented")
  }

  permitedAttributesForCreate(): string[] {
    throw new Error("Not Implemented")
  }

  permitedAttributesForUpdate(): string[] {
    throw new Error("Not Implemented")
  }
}

export default BasePolicy
