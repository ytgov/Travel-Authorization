import { Factory } from "fishery"
import { faker } from "@faker-js/faker/locale/en_CA"

import { TravelAuthorizationPreApproval } from "@/models"

export const travelAuthorizationPreApprovalFactory = Factory.define<TravelAuthorizationPreApproval>(
  ({ onCreate }) => {
    onCreate((travelAuthorizationPreApproval) => travelAuthorizationPreApproval.save())

    return TravelAuthorizationPreApproval.build({
      estimatedCost: faker.number.int({ min: 500, max: 2000 }),
      location: faker.helpers.arrayElement(["Whitehorse", "Dawson", "Watson Lake"]),
      department: "IT",
      branch: "IT",
      purpose: faker.helpers.arrayElement([
        "Annual Financial Review",
        "Marketing Campaign Launch",
        "Technology Upgrade Planning",
      ]),
      reason: faker.lorem.sentence(),
      startDate: faker.date.soon({ days: 60 }),
      endDate: faker.date.soon({ days: 180 }),
      isOpenForAnyDate: faker.datatype.boolean(),
      month: faker.date.month(),
      isOpenForAnyTraveler: faker.datatype.boolean(),
      numberTravelers: faker.number.int({ min: 1, max: 5 }),
      travelerNotes: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(["Pending", "Approved", "Reviewing"]),
    })
  }
)

export default travelAuthorizationPreApprovalFactory
