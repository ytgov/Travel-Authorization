import { Includeable } from "sequelize"
import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { TravelAuthorization } from "@/models"
import { travelPurposeFactory, userFactory } from "@/factories"
import { presence, saveAndAssociateIfNew, saveModelIfNew } from "@/factories/helpers"

type TransientParam = {
  include?: Includeable | Includeable[]
  roundTrip?: boolean
}

export const travelAuthorizationFactory = Factory.define<TravelAuthorization, TransientParam>(
  ({ associations, params, transientParams, onCreate }) => {
    onCreate(async (travelAuthorization) => {
      try {
        await saveAndAssociateIfNew(travelAuthorization, "purpose")
        await saveAndAssociateIfNew(travelAuthorization, "user")

        await travelAuthorization.save()

        if (associations.travelSegments) {
          for (const travelSegment of associations.travelSegments) {
            travelSegment.travelAuthorizationId = travelAuthorization.id
            await saveModelIfNew(travelSegment, { nested: true })
          }
        }

        if (transientParams.include === undefined) {
          return travelAuthorization
        }

        return travelAuthorization.reload({
          include: transientParams.include,
        })
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create TravelAuthorization with attributes: ${JSON.stringify(
            travelAuthorization.dataValues,
            null,
            2
          )}`
        )
      }
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
      slug: faker.string.uuid(),
      oneWayTrip,
      multiStop,
    })

    travelAuthorization.purpose = associations.purpose ?? travelPurposeFactory.build()
    travelAuthorization.user = associations.user ?? userFactory.build()

    return travelAuthorization
  }
)

export default travelAuthorizationFactory
