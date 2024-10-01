<template>
  <v-btn
    v-bind="$attrs"
    :loading="isLoading"
    v-on="$listeners"
    @click="exportToCsv"
  >
    <template #default>
      <slot> Export To CSV </slot>
    </template>
  </v-btn>
</template>

<script setup>
import { computed } from "vue"
import { ExportToCsv } from "export-to-csv"
import { isNil, isEmpty, first, last } from "lodash"
import { DateTime } from "luxon"

import { useI18n } from "@/plugins/vue-i18n-plugin"
import useTravelDeskTravelRequests, {
  TRAVEL_DESK_TRAVEL_REQUEST_STATUSES,
} from "@/use/use-travel-desk-travel-requests"

const props = defineProps({
  travelDeskTravelRequestIds: Array,
})

const { t } = useI18n()

// TODO: include travel authorization in response
const travelDeskTravelRequestsQuery = computed(() => {
  return {
    where: {
      id: props.travelDeskTravelRequestIds,
    },
  }
})
const { travelDeskTravelRequests, isLoading } = useTravelDeskTravelRequests(
  travelDeskTravelRequestsQuery,
  {
    skipWatchIf: () =>
      isNil(props.travelDeskTravelRequestIds) || isEmpty(props.travelDeskTravelRequestIds),
  }
)

// TODO: move to back-end see https://github.com/icefoganalytics/internal-data-portal/blob/main/api/src/controllers/download/datasets-controller.ts
async function exportToCsv() {
  const csvInfo = travelDeskTravelRequests.value.map((travelDeskTravelRequest) => {
    const { status, travelAuthorization, travelDeskOfficer } = travelDeskTravelRequest
    const { travelSegments, user } = travelAuthorization

    const submissionDate = travelDeskTravelRequest.createdAt.slice(0, 10)

    const { firstName, lastName } = user
    const userDisplayName = [firstName, lastName].filter(Boolean).join(" ")

    const department = travelAuthorization.department ?? ""
    const branch = travelAuthorization.branch ?? ""
    const travelStartDate = determineStartDate(travelSegments)
    const travelEndDate = determineEndDate(travelSegments, travelAuthorization.dateBackToWork)
    const locationsTraveled = determineLocationsTraveled(travelSegments)
    const requestedOptions = determineRequestedOptions(travelDeskTravelRequest)
    const formattedStatus = determineStatus(status, travelDeskOfficer)
    const formattedTravelDeskOfficer = travelDeskOfficer ?? ""

    return {
      ["Submit Date"]: submissionDate,
      ["Name"]: userDisplayName,
      ["Department"]: department,
      ["Branch"]: branch,
      ["Travel Start Date"]: travelStartDate,
      ["Travel End Date"]: travelEndDate,
      ["Location"]: locationsTraveled,
      ["Requested"]: requestedOptions,
      ["Status"]: formattedStatus,
      ["Travel Desk Officer"]: formattedTravelDeskOfficer,
    }
  })

  const timestamp = DateTime.now().toFormat("yyyy-LL-dd")

  const options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: false,
    title: "",
    // TODO: use better, or new library to get _ (underscores) out of file name
    filename: `Export, Travel Desk Requests, ${timestamp}`,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  }
  const csvExporter = new ExportToCsv(options)
  csvExporter.generateCsv(csvInfo)
}

function determineStartDate(travelSegments) {
  const firstTravelSegment = first(travelSegments)
  return firstTravelSegment.departureOn
}

function determineEndDate(travelSegments, dateBackToWork) {
  if (dateBackToWork) {
    return dateBackToWork.slice(0, 10)
  }

  const lastTravelSegment = last(travelSegments)
  return lastTravelSegment.departureOn
}

function determineLocationsTraveled(travelSegments) {
  const names = new Set()

  for (const travelSegment of travelSegments) {
    const { departureLocation, arrivalLocation } = travelSegment
    const name = `${departureLocation.city} (${departureLocation.province})`
    names.add(name)
  }

  return Array.from(names).join(", ")
}

function determineRequestedOptions(travelDeskTravelRequest) {
  const requested = []

  if (!isEmpty(travelDeskTravelRequest.flightRequests)) {
    requested.push("flight")
  }

  if (!isEmpty(travelDeskTravelRequest.hotels)) {
    requested.push("hotel")
  }

  if (!isEmpty(travelDeskTravelRequest.rentalCars)) {
    requested.push("rental car")
  }

  if (!isEmpty(travelDeskTravelRequest.otherTransportations)) {
    requested.push("transportation")
  }

  return requested.join(", ")
}

function determineStatus(status, travelDeskOfficer) {
  if (
    status === TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.SUBMITTED &&
    (isNil(travelDeskOfficer) || isEmpty(travelDeskOfficer))
  ) {
    return "Not started"
  }

  return t(`travel_desk_travel_request.status.${status}`, {
    $default: status,
  })
}
</script>
