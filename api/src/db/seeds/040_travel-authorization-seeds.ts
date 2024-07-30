import { Knex } from "knex"
import { isNil } from "lodash"

import {
  Stop,
  TravelAuthorization,
  TravelAuthorizationPreApprovalProfile,
  TravelPurpose,
} from "@/models"

export async function seed(_knex: Knex): Promise<void> {
  const travelAuthorizationPreApprovalProfiles =
    await TravelAuthorizationPreApprovalProfile.findAll()
  if (travelAuthorizationPreApprovalProfiles.length < 3) {
    throw new Error("Could not find enough travel authorization pre-approvals.")
  }

  const travelPurposeInfoTech = await TravelPurpose.findOne({ where: { purpose: "IT" } })
  if (isNil(travelPurposeInfoTech)) {
    throw new Error("Could not find IT travel purpose.")
  }

  const travelAuthorizationsAttributes = [
    {
      userId: 1,
      firstName: "John",
      lastName: "Doe",
      department: "IT",
      division: "IT",
      branch: "IT",
      unit: "IT",
      email: "Max.parker@yukon.ca",
      mailcode: "123",
      daysOffTravelStatus: 1,
      dateBackToWork: new Date("2019-01-01"),
      travelDuration: 1,
      purposeId: travelPurposeInfoTech.id,
      travelAdvance: 4,
      eventName: "An Event",
      summary: "Summary",
      benefits: "Benefits",
      status: TravelAuthorization.Statuses.APPROVED,
      slug: "2c2db7f4-5711-40c8-bd54-a6b7ad306319",
      supervisorEmail: "dpdavids@ynet.gov.yk.ca",
      preApprovalProfileId: travelAuthorizationPreApprovalProfiles[0].id,
      requestChange: "",
      denialReason: "",
      oneWayTrip: true,
      multiStop: true,
      createdBy: 1,
    },
    {
      userId: 1,
      firstName: "Jane",
      lastName: "Doe",
      department: "IT",
      division: "IT",
      branch: "IT",
      unit: "IT",
      email: "Max.parker@yukon.ca",
      mailcode: "123",
      daysOffTravelStatus: 1,
      dateBackToWork: new Date("2019-01-01"),
      travelDuration: 1,
      purposeId: travelPurposeInfoTech.id,
      travelAdvance: 4,
      eventName: "An Event",
      summary: "Summary",
      benefits: "Benefits",
      status: TravelAuthorization.Statuses.APPROVED,
      slug: "2c2db7f4-5711-40c8-bd54-a6b7ad306311",
      supervisorEmail: "dpdavids@ynet.gov.yk.ca",
      preApprovalProfileId: travelAuthorizationPreApprovalProfiles[1].id,
      requestChange: "",
      denialReason: "",
      oneWayTrip: true,
      multiStop: true,
      createdBy: 1,
    },
    {
      userId: 1,
      firstName: "Some Other",
      lastName: "Guy",
      department: "IT",
      division: "IT",
      branch: "IT",
      unit: "IT",
      email: "Max.parker@yukon.ca",
      mailcode: "123",
      daysOffTravelStatus: 1,
      dateBackToWork: new Date("2019-01-01"),
      travelDuration: 1,
      purposeId: travelPurposeInfoTech.id,
      travelAdvance: 4,
      eventName: "An Event",
      summary: "Summary",
      benefits: "Benefits",
      status: TravelAuthorization.Statuses.APPROVED,
      slug: "2c2db7f4-5711-40c8-bd54-a6b7ad306312",
      supervisorEmail: "dpdavids@ynet.gov.yk.ca",
      preApprovalProfileId: travelAuthorizationPreApprovalProfiles[2].id,
      requestChange: "",
      denialReason: "",
      oneWayTrip: true,
      multiStop: true,
      createdBy: 1,
    },
  ]
  const travelAuthorizations = []
  for (const travelAuthorizationAttributes of travelAuthorizationsAttributes) {
    let travelAuthorization = await TravelAuthorization.findOne({
      where: { slug: travelAuthorizationAttributes.slug },
    })
    if (isNil(travelAuthorization)) {
      travelAuthorization = await TravelAuthorization.create(travelAuthorizationAttributes)
    } else {
      await travelAuthorization.update(travelAuthorizationAttributes)
    }
    travelAuthorizations.push(travelAuthorization)
  }

  const stopsAttributes = [
    {
      travelAuthorizationId: travelAuthorizations[0].id,
      locationId: 1,
      departureDate: new Date("2023-05-12"),
      departureTime: "12:00:00",
      transport: "Plane",
    },
    {
      travelAuthorizationId: travelAuthorizations[0].id,
      locationId: 2,
      departureDate: new Date("2019-05-15"),
      departureTime: "12:00:00",
      transport: "Plane",
    },
    {
      travelAuthorizationId: travelAuthorizations[1].id,
      locationId: 3,
      departureDate: new Date("2023-05-12"),
      departureTime: "12:00:00",
      transport: "Plane",
    },
    {
      travelAuthorizationId: travelAuthorizations[1].id,
      locationId: 4,
      departureDate: new Date("2019-05-15"),
      departureTime: "12:00:00",
      transport: "Plane",
    },
    {
      travelAuthorizationId: travelAuthorizations[2].id,
      locationId: 5,
      departureDate: new Date("2023-05-12"),
      departureTime: "12:00:00",
      transport: "Plane",
    },
    {
      travelAuthorizationId: travelAuthorizations[2].id,
      locationId: 6,
      departureDate: new Date("2019-05-15"),
      departureTime: "12:00:00",
      transport: "Plane",
    },
  ]
  for (const stopAttributes of stopsAttributes) {
    const stop = await Stop.findOne({
      where: {
        travelAuthorizationId: stopAttributes.travelAuthorizationId,
        locationId: stopAttributes.locationId,
        transport: stopAttributes.transport,
      },
    })
    if (isNil(stop)) {
      await Stop.create(stopAttributes)
    } else {
      await stop.update(stopAttributes)
    }
  }
}
