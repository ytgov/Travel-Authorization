import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { TravelDeskTravelRequest } from "@/models"
import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"
import travelAuthorizationFactory from "@/factories/travel-authorization-factory"

export const travelDeskTravelRequestFactory = Factory.define<TravelDeskTravelRequest>(
  ({ onCreate, associations }) => {
    onCreate(async (travelDeskTravelRequest) => {
      try {
        await nestedSaveAndAssociateIfNew(travelDeskTravelRequest)
        return travelDeskTravelRequest
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create TravelDeskTravelRequest with attributes: ${JSON.stringify(
            travelDeskTravelRequest.dataValues,
            null,
            2
          )}`
        )
      }
    })

    const travelDeskTravelRequest = TravelDeskTravelRequest.build({
      legalFirstName: faker.person.firstName(),
      legalLastName: faker.person.lastName(),
      strAddress: faker.location.streetAddress(),
      city: faker.location.city(),
      province: faker.location.state(),
      postalCode: faker.location.zipCode(),
      travelPurpose: faker.lorem.sentence(),
      busPhone: faker.phone.number(),
      busEmail: faker.internet.email(),
      status: faker.helpers.enumValue(TravelDeskTravelRequest.Statuses),
    })
    travelDeskTravelRequest.travelAuthorization =
      associations.travelAuthorization ?? travelAuthorizationFactory.build()
    return travelDeskTravelRequest
  }
)

export default travelDeskTravelRequestFactory
