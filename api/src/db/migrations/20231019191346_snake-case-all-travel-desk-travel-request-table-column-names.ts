import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("travel_desk_travel_requests", (table) => {
    table.renameColumn("legalFirstName", "legal_first_name")
    table.renameColumn("legalMiddleName", "legal_middle_name")
    table.renameColumn("legalLastName", "legal_last_name")
    table.renameColumn("birthDate", "birth_date")
    table.renameColumn("strAddress", "str_address")
    table.renameColumn("postalCode", "postal_code")
    table.renameColumn("passportCountry", "passport_country")
    table.renameColumn("passportNum", "passport_num")
    table.renameColumn("travelPurpose", "travel_purpose")
    table.renameColumn("travelLocation", "travel_location")
    table.renameColumn("travelNotes", "travel_notes")
    table.renameColumn("busPhone", "bus_phone")
    table.renameColumn("busEmail", "bus_email")
    table.renameColumn("travelContact", "travel_contact")
    table.renameColumn("travelPhone", "travel_phone")
    table.renameColumn("travelEmail", "travel_email")
    table.renameColumn("additionalInformation", "additional_information")
    table.renameColumn("submitDate", "submit_date")
    table.renameColumn("travelDeskOfficer", "travel_desk_officer")
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("travel_desk_travel_requests", (table) => {
    table.renameColumn("legal_first_name", "legalFirstName")
    table.renameColumn("legal_middle_name", "legalMiddleName")
    table.renameColumn("legal_last_name", "legalLastName")
    table.renameColumn("birth_date", "birthDate")
    table.renameColumn("str_address", "strAddress")
    table.renameColumn("postal_code", "postalCode")
    table.renameColumn("passport_country", "passportCountry")
    table.renameColumn("passport_num", "passportNum")
    table.renameColumn("travel_purpose", "travelPurpose")
    table.renameColumn("travel_location", "travelLocation")
    table.renameColumn("travel_notes", "travelNotes")
    table.renameColumn("bus_phone", "busPhone")
    table.renameColumn("bus_email", "busEmail")
    table.renameColumn("travel_contact", "travelContact")
    table.renameColumn("travel_phone", "travelPhone")
    table.renameColumn("travel_email", "travelEmail")
    table.renameColumn("additional_information", "additionalInformation")
    table.renameColumn("submit_date", "submitDate")
    table.renameColumn("travel_desk_officer", "travelDeskOfficer")
  })
}
