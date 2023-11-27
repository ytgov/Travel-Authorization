import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { TravelAuthorization } from "@/models"
import { travelPurposeFactory, POSTGRES_INT_4_MAX } from "@/factories"

export const travelAuthorizationFactory = Factory.define<TravelAuthorization>(
  ({ sequence, associations, onCreate }) => {
    onCreate(async (travelAuthorization) => {
      associations.purpose ||= travelPurposeFactory.build()

      const purpose = await associations.purpose.save().catch((error) => {
        console.error(error)
        throw error
      })
      travelAuthorization.purposeId = purpose.id

      return travelAuthorization.save().catch((error) => {
        console.error(error)
        throw error
      })
    })

    associations.purpose ||= travelPurposeFactory.build()

    return TravelAuthorization.build({
      id: sequence,
      slug: faker.string.uuid(),
      preappId: faker.number.int({ min: 1, max: POSTGRES_INT_4_MAX }),
      purposeId: associations.purpose.id,
      userId: faker.number.int({ min: 1, max: POSTGRES_INT_4_MAX }),
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
      supervisorEmail: faker.internet.exampleEmail(),
      requestChange: faker.lorem.sentence(),
      denialReason: faker.lorem.sentence(),
      oneWayTrip: faker.datatype.boolean(),
      multiStop: faker.datatype.boolean(),
      createdBy: faker.number.int({ min: 1, max: POSTGRES_INT_4_MAX }),
      travelAdvanceInCents: faker.number.int({ min: 0, max: 3000 * 100 }),
      allTravelWithinTerritory: faker.datatype.boolean(),
    })
  }
)

export default travelAuthorizationFactory
