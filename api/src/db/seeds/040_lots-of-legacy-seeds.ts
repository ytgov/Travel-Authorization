import { Knex } from "knex"
import { isNull } from "lodash"

import {
  Stop,
  TravelAuthorization,
  TravelAuthorizationPreApprovalProfile,
  TravelDeskTravelRequest,
  TravelPurpose,
} from "@/models"

export async function seed(_knex: Knex): Promise<void> {
  const travelAuthorizationPreApprovalProfiles =
    await TravelAuthorizationPreApprovalProfile.findAll()
  if (travelAuthorizationPreApprovalProfiles.length < 3) {
    throw new Error("Could not find enough travel authorization pre-approvals.")
  }

  // INSERT INTO public.forms ("userId","firstName","lastName",department,division,branch,unit,email,mailcode,"daysOffTravelStatus","dateBackToWork","travelDuration",purpose,"travelAdvance","eventName",summary,benefits,status,"formId","supervisorEmail","preApprovalId",approved,"requestChange","denialReason","oneWayTrip","multiStop","createdBy") VALUES
  //  (2,'Max','Parker','Highways and Public Works',NULL,NULL,NULL,'max.parker@yukon.ca',NULL,NULL,'2023-03-18',10,'Conference',1,'Global Biotechnology Summit',NULL,NULL,'Approved','1',NULL,1,NULL,NULL,NULL,false,true,NULL),
  //  (2,'Max','Parker','Highways and Public Works',NULL,NULL,NULL,'max.parker@yukon.ca',NULL,NULL,'2023-03-20',3,'Conference',1,'Gelobal  IT',NULL,NULL,'Approved','3',NULL,3,NULL,NULL,NULL,false,true,NULL),
  //  (1,'Hassan','Anvar','Highways and Public Works',NULL,NULL,NULL,'hassan.anvar@pacificintelligent.com',NULL,NULL,'2023-03-22',2,'Conference',1,'Gelobal  IT',NULL,NULL,'Approved','4',NULL,4,NULL,NULL,NULL,false,true,NULL),
  //  (2,'Jeff','Barnhardt','Highways and Public Works',NULL,NULL,NULL,'jeff.barnhardt@yukon.ca',NULL,NULL,'2023-03-25',5,'Conference',1,'Gelobal IT',NULL,NULL,'Approved','2',NULL,2,NULL,NULL,NULL,false,true,NULL);
  //  INSERT INTO public.stops (taid,"locationId","departureDate","departureTime",transport) VALUES
  //  (4,405,'2023-03-22','08:00:00','Plane'),
  //  (1,436,'2023-03-12','12:00:00','Plane'),
  //  (1,431,'2023-03-12','16:00:00','Plane'),
  //  (2,445,'2023-03-20','08:00:00','Plane'),
  //  (3,585,'2023-03-20','09:00:00','Plane');

  const travelPurposeInfoTech = await TravelPurpose.findOne({ where: { purpose: "IT" } })
  if (isNull(travelPurposeInfoTech)) {
    throw new Error("Could not find IT travel purpose.")
  }
  const [travelAuthorization1, travelAuthorization2, travelAuthorization3] =
    await TravelAuthorization.bulkCreate([
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
    ])

  // t.increments("id").notNullable().primary();
  // t.integer("travelAuthorizationId").notNullable();
  // t.integer("locationId");
  // t.specificType("departureDate", "DATE");
  // t.time("departureTime");
  // t.string("transport");

  await Stop.destroy({ where: {} })
  await Stop.bulkCreate([
    {
      travelAuthorizationId: travelAuthorization1.id,
      locationId: 1,
      departureDate: new Date("2023-05-12"),
      departureTime: "12:00:00",
      transport: "Plane",
    },
    {
      travelAuthorizationId: travelAuthorization1.id,
      locationId: 2,
      departureDate: new Date("2019-05-15"),
      departureTime: "12:00:00",
      transport: "Plane",
    },
    {
      travelAuthorizationId: travelAuthorization2.id,
      locationId: 3,
      departureDate: new Date("2023-05-12"),
      departureTime: "12:00:00",
      transport: "Plane",
    },
    {
      travelAuthorizationId: travelAuthorization2.id,
      locationId: 4,
      departureDate: new Date("2019-05-15"),
      departureTime: "12:00:00",
      transport: "Plane",
    },
    {
      travelAuthorizationId: travelAuthorization3.id,
      locationId: 5,
      departureDate: new Date("2023-05-12"),
      departureTime: "12:00:00",
      transport: "Plane",
    },
    {
      travelAuthorizationId: travelAuthorization3.id,
      locationId: 6,
      departureDate: new Date("2019-05-15"),
      departureTime: "12:00:00",
      transport: "Plane",
    },
  ])

  await TravelDeskTravelRequest.destroy({ where: {} })
}
