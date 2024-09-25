import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { Stop } from "@/models"
import { locationFactory, travelAuthorizationFactory } from "@/factories"
import { anytime, ensureModelId, saveModelIfNew } from "@/factories/helpers"

export const stopFactory = Factory.define<Stop>(({ associations, params, onCreate }) => {
  const { id: travelAuthorizationId, model: travelAuthorizationModel } = ensureModelId(
    params.travelAuthorizationId,
    associations.travelAuthorization,
    () => travelAuthorizationFactory.build()
  )
  const { id: locationId, model: locationModel } = ensureModelId(
    params.locationId,
    associations.location,
    () => locationFactory.build()
  )

  onCreate(async (stop) => {
    await saveModelIfNew(travelAuthorizationModel, { nested: true })
    await saveModelIfNew(locationModel)

    return stop.save()
  })

  const stop = Stop.build({
    travelAuthorizationId,
    locationId,
    departureDate: faker.date.soon(),
    departureTime: anytime(),
    transport: faker.helpers.arrayElement(Object.values(Stop.TravelMethods)),
    accommodationType: faker.helpers.arrayElement(Object.values(Stop.AccommodationTypes)),
  })
  stop.travelAuthorization = travelAuthorizationModel // required for nested save
  stop.location = locationModel
  return stop
})

export default stopFactory
