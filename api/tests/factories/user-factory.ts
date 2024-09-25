import { Factory } from "fishery"
import { faker } from "@faker-js/faker/locale/en_CA"

import { User } from "@/models"

export const userFactory = Factory.define<User>(({ sequence, params, onCreate }) => {
  onCreate((user) => {
    try {
      return user.save()
    } catch (error) {
      console.error(error)
      throw new Error(
        `Could not create User with attributes: ${JSON.stringify(user.dataValues, null, 2)}`
      )
    }
  })

  const firstName = params.firstName || faker.person.firstName()
  const lastName = params.lastName || faker.person.lastName()

  return User.build({
    id: sequence,
    sub: `auth0|${faker.string.uuid()}`,
    email: faker.internet.email({ firstName, lastName }),
    status: User.Statuses.ACTIVE,
    firstName,
    lastName,
    roles: faker.helpers.arrayElements(Object.values(User.Roles), {
      min: 1,
      max: 3,
    }),
  })
})

export default userFactory
