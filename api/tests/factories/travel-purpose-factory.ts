import { Factory } from "fishery"
import { faker } from "@faker-js/faker"

import { TravelPurpose } from "@/models"

export const travelPurposeFactory = Factory.define<TravelPurpose>(({ sequence, onCreate }) => {
  onCreate((travelPurpose) => travelPurpose.save())

  return TravelPurpose.build({
    purpose: `${faker.lorem.words(2)}-${sequence}`,
  })
})

export default travelPurposeFactory
