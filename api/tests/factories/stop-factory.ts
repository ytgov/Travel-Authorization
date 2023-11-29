import { Factory } from "fishery"
import { faker } from "@faker-js/faker"
import { isNil } from "lodash"

import { Stop } from "@/models"
import { anytime, locationFactory, travelAuthorizationFactory } from "@/factories"

export const stopFactory = Factory.define<Stop>(({ associations, onCreate }) => {
  onCreate(async (stop) => {
    if (isNil(stop.travelAuthorizationId)) {
      const travelAuthorization =
        associations.travelAuthorization || travelAuthorizationFactory.build()
      await travelAuthorization.save()
      stop.travelAuthorizationId = travelAuthorization.id
    }

    if (stop.locationId === undefined) {
      const location = associations.location || locationFactory.build()
      await location.save()
      stop.locationId = location.id
    }

    return stop.save()
  })

  return Stop.build({
    departureDate: faker.date.soon(),
    departureTime: anytime(),
    transport: faker.helpers.arrayElement(Object.values(Stop.TravelMethods)),
    accommodationType: faker.helpers.arrayElement(Object.values(Stop.AccommodationTypes)),
  })
})

export default stopFactory
