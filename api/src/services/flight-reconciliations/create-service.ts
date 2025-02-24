import { isNil } from "lodash"

import { User, FlightReconciliation } from "@/models"
import BaseService from "@/services/base-service"

type FlightSegmentAttributes = Partial<FlightReconciliation>

export class CreateService extends BaseService {
  constructor(
    protected attributes: FlightSegmentAttributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<FlightReconciliation> {
    const { externalTravComIdentifier, ...optionalAttributes } =
      this.attributes

    if (isNil(externalTravComIdentifier)) {
      throw new Error("External TravCom identifier is required.")
    }

    const flightReconciliation = await FlightReconciliation.create({
      ...optionalAttributes,
      reconcilerId: this.currentUser.id,
      externalTravComIdentifier,
    })
    return flightReconciliation
  }
}

export default CreateService
