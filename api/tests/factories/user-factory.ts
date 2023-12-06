import { Factory } from "fishery"
import { faker } from "@faker-js/faker/locale/en_CA"

import { User } from "@/models"

export const userFactory = Factory.define<User>(({ params, onCreate }) => {
  onCreate((user) => user.save())

  const generateMailCode = () => {
    const letters = faker.string.alpha({ length: { min: 1, max: 4 } }).toUpperCase()
    const numbers = faker.number.int({ min: 1, max: 9999 })
    return `${letters}${numbers}`
  }

  const firstName = params.firstName || faker.person.firstName()
  const lastName = params.lastName || faker.person.lastName()

  return User.build({
    sub: `auth0|${faker.string.uuid()}`,
    email: faker.internet.email({ firstName, lastName }),
    status: User.Statuses.ACTIVE,
    firstName,
    lastName,
    department: faker.datatype.boolean(0.9) ? faker.commerce.department() : null,
    roles: faker.helpers.arrayElements(Object.values(User.Roles), {
      min: 1,
      max: 3,
    }),
    division: faker.datatype.boolean(0.5) ? faker.lorem.word() : null,
    branch: faker.datatype.boolean(0.2) ? faker.lorem.word() : null,
    unit: faker.datatype.boolean(0.1) ? faker.lorem.word() : null,
    mailcode: faker.datatype.boolean(0.7) ? generateMailCode() : null,
    manager: faker.datatype.boolean(0.9) ? faker.person.fullName() : null,
    lastEmployeeDirectorySyncAt: faker.date.recent(),
  })
})

export default userFactory
