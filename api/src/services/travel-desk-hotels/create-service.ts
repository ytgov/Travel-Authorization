import { isNil } from "lodash"

import { TravelDeskHotel, User } from "@/models"

import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskHotel>

export class CreateService extends BaseService {
  constructor(protected attributes: Attributes, protected currentUser: User) {
    super()
  }

  async perform(): Promise<TravelDeskHotel> {
    const {
      travelRequestId,
      city,
      isDedicatedConferenceHotelAvailable,
      conferenceName,
      conferenceHotelName,
      checkIn,
      checkOut,
      ...optionalAttributes
    } = this.attributes

    if (isNil(travelRequestId)) {
      throw new Error("Travel request ID is required.")
    }

    if (isNil(city)) {
      throw new Error("City is required.")
    }

    if (isNil(isDedicatedConferenceHotelAvailable)) {
      throw new Error("Is dedicated conference hotel available is required.")
    }

    if (isNil(conferenceName)) {
      throw new Error("Conference name is required.")
    }

    if (isNil(conferenceHotelName)) {
      throw new Error("Conference hotel name is required.")
    }

    if (isNil(checkIn)) {
      throw new Error("Check-in date is required.")
    }

    if (isNil(checkOut)) {
      throw new Error("Check-out date is required.")
    }

    return TravelDeskHotel.create({
      travelRequestId,
      city,
      isDedicatedConferenceHotelAvailable,
      conferenceName,
      conferenceHotelName,
      checkIn,
      checkOut,
      ...optionalAttributes,
      status: TravelDeskHotel.Statuses.REQUESTED,
    })
  }
}

export default CreateService
