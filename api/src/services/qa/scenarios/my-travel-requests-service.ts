import { v4 as uuid } from "uuid"

import BaseService from "@/services/base-service"
import { TravelAuthorization, Stop, Location, User } from "@/models"

export class MyTravelRequestsService extends BaseService {
  private user: User

  constructor(user: User) {
    super()
    this.user = user
  }

  async perform(): Promise<void> {
    // Phase: Travel Planning
    // Location: Vancouver
    // Description: Conference
    // Start Date: 12-May-2023
    // End Date: 14-May-2023
    // Travel Auth Status: Approved
    // Travel Action: Submit Travel Desk Request

    // cleanup
    Stop.destroy({ where: {} })
    TravelAuthorization.destroy({ where: {} })

    // build the core travel authorization
    const [travelAuthorization1] = await TravelAuthorization.findOrCreate({
      where: {
        userId: this.user.id,
        slug: uuid(),
        status: TravelAuthorization.Statuses.APPROVED,
        eventName: "Conference",
      },
      defaults: {
        userId: this.user.id,
        slug: uuid(),
        status: TravelAuthorization.Statuses.APPROVED,
        eventName: "Conference",
      },
    })

    // build some stops
    const [vancouverLocation] = await Location.findOrCreate({
      where: { city: "Vancouver", province: "British Columbia" },
      defaults: { city: "Vancouver", province: "British Columbia" },
    })

    const [_firstStop] = await Stop.findOrCreate({
      where: {
        travelAuthorizationId: travelAuthorization1.id,
        locationId: vancouverLocation.id,
        departureDate: new Date("2023-05-12T00:00:00Z"),
        departureTime: "00:00:00",
        transport: Stop.TravelMethods.AIRCRAFT,
      },
      defaults: {
        travelAuthorizationId: travelAuthorization1.id,
        locationId: vancouverLocation.id,
        departureDate: new Date("2023-05-12T00:00:00Z"),
        departureTime: "00:00:00",
        transport: Stop.TravelMethods.AIRCRAFT,
      },
    })

    const [_lastStop] = await Stop.findOrCreate({
      where: {
        travelAuthorizationId: travelAuthorization1.id,
        locationId: vancouverLocation.id,
        departureDate: new Date("2023-05-14T00:00:00Z"),
        departureTime: "00:00:00",
        transport: Stop.TravelMethods.AIRCRAFT,
      },
      defaults: {
        travelAuthorizationId: travelAuthorization1.id,
        locationId: vancouverLocation.id,
        departureDate: new Date("2023-05-14T00:00:00Z"),
        departureTime: "00:00:00",
        transport: Stop.TravelMethods.AIRCRAFT,
      },
    })
  }
}

export default MyTravelRequestsService
