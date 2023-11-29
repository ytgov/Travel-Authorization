import { Factory } from "fishery"
import { faker } from "@faker-js/faker/locale/en_CA"

import { Location } from "@/models"

export const locationFactory = Factory.define<Location>(({ onCreate }) => {
  onCreate((location) => location.save())

  return Location.build({
    province: faker.location.state(),
    city: faker.location.city(),
  })
})

export default locationFactory
