import { Knex } from "knex"

import { TravelAuthorization, TravelPurpose, User } from "@/models"

export async function seed(knex: Knex): Promise<void> {
  await User.update({ roles: [User.Roles.USER] }, { where: {} })
  await User.update(
    { roles: [User.Roles.ADMIN] },
    {
      where: {
        email: [
          "Max.parker@yukon.ca",
          "dpdavids@ynet.gov.yk.ca",
          "hassan.anvar@pacificintelligent.com",
        ],
      },
    }
  )

  await knex("roles").delete().whereRaw("1=1")
  const rolesAttributes = Object.values(User.Roles).map((role) => ({ name: role }))
  await knex("roles").insert(rolesAttributes)

  await TravelAuthorization.destroy({ where: {} })
  await TravelPurpose.destroy({ where: {} })
  await TravelPurpose.bulkCreate([
    {
      purpose: "Maintenance",
    },
    {
      purpose: "Conference",
    },
    {
      purpose: "Workshop",
    },
    {
      purpose: "General Travel",
    },
    {
      purpose: "Community Travel",
    },
    {
      purpose: "IT",
    },
  ])

  await knex("transportMethod").delete().whereRaw("1=1")
  await knex("transportMethod").insert([
    {
      method: "Rental vehicle",
    },
    {
      method: "Personal vehicle",
    },
    {
      method: "Fleet vehicle",
    },
    {
      method: "Plane",
    },
  ])
}
