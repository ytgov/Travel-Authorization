import { Factory } from "fishery"
import { faker } from "@faker-js/faker"
import { isNil } from "lodash"

import { TravelAuthorization, TravelPurpose } from "@/models"
import { travelPurposeFactory, POSTGRES_INT_4_MAX, userFactory } from "@/factories"

export const travelAuthorizationFactory = Factory.define<TravelAuthorization>(
  ({ sequence, associations, onCreate }) => {
    onCreate(async (travelAuthorization) => {
      if (isNil(travelAuthorization.purposeId)) {
        const purpose = associations.purpose || travelPurposeFactory.build()
        await purpose.save()
        travelAuthorization.purposeId = purpose.id
      }

      if (isNil(travelAuthorization.userId)) {
        const user = associations.user || userFactory.build()
        await user.save()
        travelAuthorization.userId = user.id
      }


      return travelAuthorization.save()
    })

    return TravelAuthorization.build({
      id: sequence,
      slug: faker.string.uuid(),
      preappId: faker.number.int({ min: 1, max: POSTGRES_INT_4_MAX }), // TODO: add factories once foreign key constraint exists
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      department: faker.commerce.department(),
      division: faker.company.buzzNoun(),
      branch: faker.company.buzzAdjective(),
      unit: faker.company.catchPhraseDescriptor(),
      email: faker.internet.exampleEmail(),
      mailcode: faker.location.zipCode(),
      daysOffTravelStatus: faker.number.int({ min: 1, max: 14 }),
      dateBackToWork: faker.date.future(),
      travelDuration: faker.number.int({ min: 1, max: 14 }),
      travelAdvance: faker.number.int({ min: 0, max: 3000 }),
      eventName: faker.company.catchPhrase(),
      summary: faker.lorem.sentence(),
      benefits: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(Object.values(TravelAuthorization.Statuses)),
      supervisorEmail: faker.internet.exampleEmail(), // TODO: add factories once foreign key constraint exists
      requestChange: faker.lorem.sentence(),
      denialReason: faker.lorem.sentence(),
      oneWayTrip: faker.datatype.boolean(),
      multiStop: faker.datatype.boolean(),
      createdBy: faker.number.int({ min: 1, max: POSTGRES_INT_4_MAX }),
      travelAdvanceInCents: faker.number.int({ min: 0, max: 3000 * 100 }), // TODO: add factories once foreign key constraint exists
      allTravelWithinTerritory: faker.datatype.boolean(),
    })
  }
)

export default travelAuthorizationFactory
