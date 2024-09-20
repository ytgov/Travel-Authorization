import { isNil } from "lodash"

import { TravelDeskTravelAgency, User } from "@/models"

import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskTravelAgency>

export class CreateService extends BaseService {
  constructor(
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskTravelAgency> {
    const { agencyName, ...optionalAttributes } = this.attributes

    if (isNil(agencyName)) {
      throw new Error("Agency name is required.")
    }

    return TravelDeskTravelAgency.create({
      agencyName,
      ...optionalAttributes,
    })
  }
}

export default CreateService
