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
    const {
      externalTravComIdentifier,
      invoiceDetailSellingFare,
      invoiceDetailVendorName,
      invoiceDetailComputedTravelerFirstName,
      invoiceDetailComputedTravelerLastName,
      ...optionalAttributes
    } = this.attributes

    if (isNil(externalTravComIdentifier)) {
      throw new Error("External TravCom identifier is required.")
    }

    if (isNil(invoiceDetailSellingFare)) {
      throw new Error("Invoice detail selling fare is required.")
    }

    if (isNil(invoiceDetailVendorName)) {
      throw new Error("Invoice detail vendor name is required.")
    }

    if (isNil(invoiceDetailComputedTravelerFirstName)) {
      throw new Error("Invoice detail computed traveler first name is required.")
    }

    if (isNil(invoiceDetailComputedTravelerLastName)) {
      throw new Error("Invoice detail computed traveler last name is required.")
    }

    const flightReconciliation = await FlightReconciliation.create({
      ...optionalAttributes,
      reconcilerId: this.currentUser.id,
      externalTravComIdentifier,
      invoiceDetailSellingFare,
      invoiceDetailVendorName,
      invoiceDetailComputedTravelerFirstName,
      invoiceDetailComputedTravelerLastName,
    })
    return flightReconciliation
  }
}

export default CreateService
