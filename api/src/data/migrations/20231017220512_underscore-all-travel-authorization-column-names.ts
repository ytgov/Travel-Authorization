import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("travel_authorizations", (table) => {
    table.renameColumn("formId", "form_id")
    table.renameColumn("preappId", "preapp_id")
    table.renameColumn("purposeId", "purpose_id")
    table.renameColumn("userId", "user_id")
    table.renameColumn("firstName", "first_name")
    table.renameColumn("lastName", "last_name")
    table.renameColumn("daysOffTravelStatus", "days_off_travel_status")
    table.renameColumn("dateBackToWork", "date_back_to_work")
    table.renameColumn("travelDuration", "travel_duration")
    table.renameColumn("travelAdvance", "travel_advance")
    table.renameColumn("eventName", "event_name")
    table.renameColumn("supervisorEmail", "supervisor_email")
    table.renameColumn("requestChange", "request_change")
    table.renameColumn("denialReason", "denial_reason")
    table.renameColumn("oneWayTrip", "one_way_trip")
    table.renameColumn("multiStop", "multi_stop")
    table.renameColumn("createdBy", "created_by")
    table.renameColumn("travelAdvanceInCents", "travel_advance_in_cents")
    table.renameColumn("allTravelWithinTerritory", "all_travel_within_territory")
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("travel_authorizations", (table) => {
    table.renameColumn("form_id", "formId")
    table.renameColumn("preapp_id", "preappId")
    table.renameColumn("purpose_id", "purposeId")
    table.renameColumn("user_id", "userId")
    table.renameColumn("first_name", "firstName")
    table.renameColumn("last_name", "lastName")
    table.renameColumn("days_off_travel_status", "daysOffTravelStatus")
    table.renameColumn("date_back_to_work", "dateBackToWork")
    table.renameColumn("travel_duration", "travelDuration")
    table.renameColumn("travel_advance", "travelAdvance")
    table.renameColumn("event_name", "eventName")
    table.renameColumn("supervisor_email", "supervisorEmail")
    table.renameColumn("request_change", "requestChange")
    table.renameColumn("denial_reason", "denialReason")
    table.renameColumn("one_way_trip", "oneWayTrip")
    table.renameColumn("multi_stop", "multiStop")
    table.renameColumn("created_by", "createdBy")
    table.renameColumn("travel_advance_in_cents", "travelAdvanceInCents")
    table.renameColumn("all_travel_within_territory", "allTravelWithinTerritory")
  })
}
