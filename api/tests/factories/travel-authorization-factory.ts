import { Includeable } from "sequelize"
import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { TravelAuthorization } from "@/models"
import { travelPurposeFactory, userFactory } from "@/factories"
import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"

type TransientParam = {
  include?: Includeable | Includeable[]
}

export const travelAuthorizationFactory = Factory.define<TravelAuthorization, TransientParam>(
  ({ associations, transientParams, onCreate }) => {
    onCreate(async (travelAuthorization) => {
      try {
        await nestedSaveAndAssociateIfNew(travelAuthorization)

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

    const travelAuthorization = TravelAuthorization.build({
      slug: faker.string.uuid(),
    })

    travelAuthorization.purpose = associations.purpose ?? travelPurposeFactory.build()
    travelAuthorization.user = associations.user ?? userFactory.build()

    return travelAuthorization
  }
)

export default travelAuthorizationFactory
