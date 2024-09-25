import { Factory } from "fishery"
import { faker } from "@faker-js/faker"
import { Includeable } from "sequelize"

import { TravelSegment } from "@/models"
import { locationFactory, travelAuthorizationFactory } from "@/factories"
import { ensureModelId, presence, saveModelIfNew } from "@/factories/helpers"

type TransientParam = {
  include?: Includeable | Includeable[]
}

export const travelSegmentFactory = Factory.define<TravelSegment, TransientParam>(
  ({ associations, params, onCreate, sequence, transientParams }) => {
    const { id: travelAuthorizationId, model: travelAuthorizationModel } = ensureModelId(
      params.travelAuthorizationId,
      associations.travelAuthorization,
      () => travelAuthorizationFactory.build()
    )

    const { id: departureLocationId, model: departureLocationModel } = ensureModelId(
      params.departureLocationId,
      associations.departureLocation,
      () => locationFactory.build()
    )

    const { id: arrivalLocationId, model: arrivalLocationModel } = ensureModelId(
      params.arrivalLocationId,
      associations.arrivalLocation,
      () => locationFactory.build()
    )

    onCreate(async (travelSegment) => {
      try {
        await saveModelIfNew(travelAuthorizationModel, { nested: true })
        await saveModelIfNew(departureLocationModel)
        await saveModelIfNew(arrivalLocationModel)

        await travelSegment.save()

        if (transientParams.include === undefined) {
          return travelSegment
        }

        return travelSegment.reload({
          include: transientParams.include,
        })
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create TravelSegment with attributes: ${JSON.stringify(
            travelSegment.dataValues,
            null,
            2
          )}`
        )
      }
    })

    const modeOfTransport = presence(
      params.modeOfTransport,
      faker.helpers.enumValue(TravelSegment.TravelMethods)
    )

    const travelSegment = TravelSegment.build({
      id: sequence,
      travelAuthorizationId,
      departureLocationId,
      arrivalLocationId,
      segmentNumber: faker.number.int({ min: 0, max: 100 }),
      modeOfTransport,
      modeOfTransportOther:
        modeOfTransport === TravelSegment.TravelMethods.OTHER ? faker.hacker.ingverb() : null,
    })
    travelSegment.travelAuthorization = travelAuthorizationModel // required for nested save
    travelSegment.departureLocation = departureLocationModel // required for nested save
    travelSegment.arrivalLocation = arrivalLocationModel // required for nested save
    return travelSegment
  }
)

export default travelSegmentFactory
