import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { TravelPurpose } from "@/models"

export const travelPurposeFactory = Factory.define<TravelPurpose>(({ sequence, onCreate }) => {
  onCreate((travelPurpose) => {
    return travelPurpose.save().catch((error) => {
      console.error(error)
      throw error
    })
  })

  return TravelPurpose.build({
    id: sequence,
    purpose: `${faker.lorem.words(2)}-${sequence}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
})

export default travelPurposeFactory
