import { Includeable } from "sequelize"
import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { TravelAuthorization, TravelSegment } from "@/models"
import { travelPurposeFactory, userFactory } from "@/factories"
import { ensureModelId, presence, saveModelIfNew } from "@/factories/helpers"
import { isNil } from "lodash"

type TransientParam = {
  include?: Includeable | Includeable[]
  roundTrip?: boolean
}

export const travelAuthorizationFactory = Factory.define<TravelAuthorization, TransientParam>(
  ({ sequence, associations, params, transientParams, onCreate }) => {
    const { id: purposeId, model: purposeModel } = ensureModelId(
      params.purposeId,
      associations.purpose,
      () => travelPurposeFactory.build()
    )

    const { id: userId, model: userModel } = ensureModelId(params.userId, associations.user, () =>
      userFactory.build()
    )

    onCreate(async (travelAuthorization) => {
      await saveModelIfNew(purposeModel)
      await saveModelIfNew(userModel)

      await travelAuthorization.save()

      if (associations.travelSegments) {
        const travelSegmentAttributes = associations.travelSegments.map((travelSegment) => {
          return {
            ...travelSegment.dataValues,
            travelAuthorizationId: travelAuthorization.id,
          }
        })
        await TravelSegment.bulkCreate(travelSegmentAttributes)
      }

      if (transientParams.include === undefined) {
        return travelAuthorization
      }

      return travelAuthorization.reload({
        include: transientParams.include,
      })
    })

    let oneWayTrip = presence(params.oneWayTrip, !params.multiStop && faker.datatype.boolean())
    let multiStop = presence(params.multiStop, !oneWayTrip && faker.datatype.boolean())
    if (transientParams.roundTrip === true) {
      if (params.oneWayTrip === true) {
        throw new Error("roundTrip transient param conflicts with oneWayTrip param")
      } else if (params.multiStop === true) {
        throw new Error("roundTrip transient param conflicts with multiStop param")
      }

      oneWayTrip = false
      multiStop = false
    }

    const travelAuthorization = TravelAuthorization.build({
      id: sequence,
      purposeId,
      userId,
      slug: faker.string.uuid(),
      oneWayTrip,
      multiStop,
    })
    travelAuthorization.purpose = purposeModel // required for nested save
    if (!isNil(userModel)) {
      travelAuthorization.user = userModel // required for nested save
    }
    return travelAuthorization
  }
)

export default travelAuthorizationFactory
