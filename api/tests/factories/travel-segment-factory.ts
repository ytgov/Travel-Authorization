import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { TravelSegment } from "@/models"
import { locationFactory, travelAuthorizationFactory } from "@/factories"
import { anytime, presence } from "@/factories/helpers"

export const travelSegmentFactory = Factory.define<TravelSegment>(
  ({ associations, params, onCreate }) => {
    onCreate(async (travelSegment) => {
      if (travelSegment.travelAuthorizationId === undefined) {
        const travelAuthorization =
          associations.travelAuthorization || travelAuthorizationFactory.build()
        await travelAuthorization.save()
        travelSegment.travelAuthorizationId = travelAuthorization.id
      }

      if (travelSegment.departureLocationId === undefined) {
        const departureLocation = associations.departureLocation || locationFactory.build()
        await departureLocation.save()
        travelSegment.departureLocationId = departureLocation.id
      }

      if (travelSegment.arrivalLocationId === undefined) {
        const arrivalLocation = associations.arrivalLocation || locationFactory.build()
        await arrivalLocation.save()
        travelSegment.arrivalLocationId = arrivalLocation.id
      }

      return travelSegment.save()
    })

    const modeOfTransport = presence(
      params.modeOfTransport,
      faker.helpers.enumValue(TravelSegment.TravelMethods)
    )
    const accommodationType = presence(
      params.accommodationType,
      faker.helpers.enumValue(TravelSegment.AccommodationTypes)
    )

    return TravelSegment.build({
      segmentNumber: faker.number.int({ min: 0, max: 100 }),
      departureOn: faker.date.soon(),
      departureTime: anytime(),
      modeOfTransport,
      modeOfTransportOther:
        modeOfTransport === TravelSegment.TravelMethods.OTHER ? faker.hacker.ingverb() : null,
      accommodationType,
      accommodationTypeOther:
        accommodationType === TravelSegment.AccommodationTypes.OTHER
          ? faker.company.buzzAdjective()
          : null,
    })
  }
)

export default travelSegmentFactory
