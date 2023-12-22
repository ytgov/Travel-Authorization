import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("travel_segments", (table) => {
    table.increments("id").primary()
    table
      .integer("travel_authorization_id")
      .notNullable()
      .references("id")
      .inTable("travel_authorizations")
      .onDelete("CASCADE")
    table
      .integer("departure_location_id")
      .nullable()
      .references("id")
      .inTable("locations")
      .onDelete("RESTRICT")
    table
      .integer("arrival_location_id")
      .nullable()
      .references("id")
      .inTable("locations")
      .onDelete("RESTRICT")
    table.integer("segment_number").notNullable()

    // See https://github.com/thoughtbot/guides/blob/4ab5599a6fd30b0854d566843015b33fc6fc4bc5/rails/README.md
    table.date("departure_on").nullable()
    table.time("departure_time").nullable()

    table.string("mode_of_transport", 255).notNullable()
    table.string("mode_of_transport_other", 255).nullable()
    table.string("accommodation_type", 255).nullable()
    table.string("accommodation_type_other", 255).nullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("travel_segments")
}
