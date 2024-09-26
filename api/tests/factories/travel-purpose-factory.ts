import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { TravelPurpose } from "@/models"

export const travelPurposeFactory = Factory.define<TravelPurpose>(({ sequence, onCreate }) => {
  onCreate(async (travelPurpose) => {
    try {
      return travelPurpose.save()
    } catch (error) {
      console.error(error)
      throw new Error(
        `Could not create TravelPurpose with attributes: ${JSON.stringify(
          travelPurpose.dataValues,
          null,
          2
        )}`
      )
    }
  })

  return TravelPurpose.build({
    purpose: `${faker.lorem.words(3)}-${sequence}`,
  })
})

export default travelPurposeFactory
