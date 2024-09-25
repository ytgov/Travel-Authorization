import { Factory } from "fishery"
import { faker } from "@faker-js/faker/locale/en_CA"

import { Location } from "@/models"

export const locationFactory = Factory.define<Location>(({ onCreate }) => {
  onCreate((location) => {
    try {
      return location.save()
    } catch (error) {
      console.error(error)
      throw new Error(
        `Could not create Location with attributes: ${JSON.stringify(location.dataValues, null, 2)}`
      )
    }
  })

  return Location.build({
    province: faker.location.state(),
    city: faker.location.city(),
  })
})

export default locationFactory
