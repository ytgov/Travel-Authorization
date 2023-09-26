import BaseModel from "./base-model"

export class Stop extends BaseModel {
  id: number
  taid: number // TODO: taid === forms.id, rename this column to form_id
  locationId?: number | null
  departureDate?: Date | null
  departureTime?: string | null
  transport?: string | null

  constructor(attributes: Pick<Stop, "id" | "taid"> & Partial<Stop>) {
    super()
    this.id = attributes.id
    this.taid = attributes.taid
    this.locationId = attributes.locationId
    this.departureDate = attributes.departureDate
    this.departureTime = attributes.departureTime
    this.transport = attributes.transport
  }
}

export default Stop
