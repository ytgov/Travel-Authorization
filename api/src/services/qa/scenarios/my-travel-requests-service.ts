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
    await Stop.destroy({ where: {} })
    await TravelAuthorization.destroy({ where: {} })

    // Phase: Travel Planning
    // Location: Vancouver
    // Description: Conference
    // Start Date: 12-May-2023
    // End Date: 14-May-2023
    // Travel Auth Status: Approved
    // Travel Action: Submit Travel Desk Request
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

    // Phase: Travel Approval
    // Location: Vancouver
    // Description: FN Finance meeting #3
    // Start Date: 12-May-2023
    // End Date: 14-May-2023
    // Travel Auth Status: Awaiting Director Approval
    // Travel Action: no action
    const [travelAuthorization2] = await TravelAuthorization.findOrCreate({
      where: {
        userId: this.user.id,
        eventName: "FN Finance meeting #3",
      },
      defaults: {
        userId: this.user.id,
        slug: uuid(),
        status: TravelAuthorization.Statuses.AWAITING_DIRECTOR_APPROVAL,
        eventName: "FN Finance meeting #3",
      },
    })
    const [_firstStop2] = await Stop.findOrCreate({
      where: {
        travelAuthorizationId: travelAuthorization2.id,
        locationId: vancouverLocation.id,
        departureDate: new Date("2023-05-12T00:00:00Z"),
        departureTime: "00:00:00",
      },
      defaults: {
        travelAuthorizationId: travelAuthorization2.id,
        locationId: vancouverLocation.id,
        departureDate: new Date("2023-05-12T00:00:00Z"),
        departureTime: "00:00:00",
      },
    })
    const [_lastStop2] = await Stop.findOrCreate({
      where: {
        travelAuthorizationId: travelAuthorization2.id,
        locationId: vancouverLocation.id,
        departureDate: new Date("2023-05-14T00:00:00Z"),
        departureTime: "00:00:00",
      },
      defaults: {
        travelAuthorizationId: travelAuthorization2.id,
        locationId: vancouverLocation.id,
        departureDate: new Date("2023-05-14T00:00:00Z"),
        departureTime: "00:00:00",
      },
    })
  }
}

export default MyTravelRequestsService
