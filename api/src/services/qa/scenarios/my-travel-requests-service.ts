import { v4 as uuid } from "uuid"

import BaseService from "@/services/base-service"
import { TravelAuthorization, Stop, Location, User } from "@/models"

export class MyTravelRequestsService extends BaseService {
  async perform(): Promise<void> {
    // Phase: Travel Planning
    // Location: Vancouver
    // Description: Conference
    // Start Date: 12-May-2023
    // End Date: 14-May-2023
    // Travel Auth Status: Approved
    // Travel Action: Submit Travel Desk Request

    const [myTravelRequestUser] = await User.findOrCreate({
      where: {
        sub: "TODO?",
        email: "test-my-travel-requests@test.com",
        status: User.Statuses.ACTIVE,
      },
      defaults: {
        sub: "TODO?",
        email: "test-my-travel-requests@test.com",
        status: User.Statuses.ACTIVE,
      },
    })
    const [vancouverLocation] = await Location.findOrCreate({
      where: { city: "Vancouver", province: "British Columbia" },
      defaults: { city: "Vancouver", province: "British Columbia" },
    })

    const [firstStop] = await Stop.findOrCreate({
      where: {
        locationId: vancouverLocation.id,
        departureDate: new Date("2023-05-12T00:00:00Z"),
        departureTime: "00:00:00",
        transport: Stop.TravelMethods.AIRCRAFT,
      },
      defaults: {
        locationId: vancouverLocation.id,
        departureDate: new Date("2023-05-12T00:00:00Z"),
        departureTime: "00:00:00",
        transport: Stop.TravelMethods.AIRCRAFT,
      },
    })

    const [lastStop] = await Stop.findOrCreate({
      where: {
        locationId: vancouverLocation.id,
        departureDate: new Date("2023-05-14T00:00:00Z"),
        departureTime: "00:00:00",
        transport: Stop.TravelMethods.AIRCRAFT,
      },
      defaults: {
        locationId: vancouverLocation.id,
        departureDate: new Date("2023-05-14T00:00:00Z"),
        departureTime: "00:00:00",
        transport: Stop.TravelMethods.AIRCRAFT,
      },
    })

    const slug1 = uuid()
    const [travelAuthorization1] = await TravelAuthorization.findOrCreate({
      where: {
        userId: 1,
        slug: slug1,
        status: TravelAuthorization.Statuses.APPROVED,
        eventName: "Conference",
      },
      defaults: {
        userId: 1,
        slug: slug1,
        status: TravelAuthorization.Statuses.APPROVED,
        eventName: "Conference",
      },
    })

    await travelAuthorization1.setStops([firstStop, lastStop])
  }
}

export default MyTravelRequestsService
