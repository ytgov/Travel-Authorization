import BaseModel from "./base-model"

export class Destination extends BaseModel {
  id: number
  province: string
  city: string

  constructor(attributes: Pick<Destination, "id" | "province" | "city"> & Partial<Destination>) {
    super()
    this.id = attributes.id
    this.province = attributes.province
    this.city = attributes.city
  }
}

export default Destination
