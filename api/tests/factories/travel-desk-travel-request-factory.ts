import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { TravelDeskTravelRequest } from "@/models"
import { ensureModelId, saveModelIfNew } from "@/factories/helpers"
import travelAuthorizationFactory from "@/factories/travel-authorization-factory"

export const travelDeskTravelRequestFactory = Factory.define<TravelDeskTravelRequest>(
  ({ sequence, onCreate, params, associations }) => {
    const { id: travelAuthorizationId, model: travelAuthorizationModel } = ensureModelId(
      params.travelAuthorizationId,
      associations.travelAuthorization,
      () => travelAuthorizationFactory.build()
    )

    onCreate(async (travelDeskTravelRequest) => {
      try {
        await saveModelIfNew(travelAuthorizationModel, { nested: true })

        return travelDeskTravelRequest.save()
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
      id: sequence,
      travelAuthorizationId,
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
    travelDeskTravelRequest.travelAuthorization = travelAuthorizationModel // required for nested save
    return travelDeskTravelRequest
  }
)

export default travelDeskTravelRequestFactory
