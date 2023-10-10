import BaseModel from "./base-model"

export class Stop extends BaseModel {
  id: number
  taid: number // TODO: taid === forms.id, rename this column to form_id
  locationId: number | null
  departureDate: Date | null
  departureTime: string | null
  transport: string | null
  accommodationType: string | null

  constructor(attributes: Pick<Stop, "id" | "taid"> & Partial<Stop>) {
    super()
    this.id = attributes.id
    this.taid = attributes.taid
    this.locationId = attributes.locationId || null
    this.departureDate = attributes.departureDate || null
    this.departureTime = attributes.departureTime || null
    this.transport = attributes.transport || null
    this.accommodationType = attributes.accommodationType || null
  }
}

export default Stop
