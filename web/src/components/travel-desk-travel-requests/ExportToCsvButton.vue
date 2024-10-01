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
import { useStore } from "vue2-helpers/vuex"
import { ExportToCsv } from "export-to-csv"
import { isNil, isEmpty } from "lodash"

import { useI18n } from "@/plugins/vue-i18n-plugin"
import useTravelDeskTravelRequests from "@/use/use-travel-desk-travel-requests"

const props = defineProps({
  travelDeskTravelRequestIds: Array,
})

const { t } = useI18n()
const store = useStore()

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
    return {
      createdAt: travelDeskTravelRequest.createdAt.slice(0, 10),
      name:
        travelDeskTravelRequest.travelAuthorization.firstName +
        " " +
        travelDeskTravelRequest.travelAuthorization.lastName,
      department: travelDeskTravelRequest.travelAuthorization.department,
      branch: travelDeskTravelRequest.travelAuthorization.branch
        ? travelDeskTravelRequest.travelAuthorization.branch
        : "",
      travelStartDate: travelDeskTravelRequest.startDate?.slice(0, 10),
      travelEndDate: travelDeskTravelRequest.travelAuthorization.dateBackToWork?.slice(0, 10),
      location: getLocationName(travelDeskTravelRequest.travelAuthorization.stops),
      requested: getRequested(travelDeskTravelRequest),
      status:
        travelDeskTravelRequest.status == "submitted" && !travelDeskTravelRequest.travelDeskOfficer
          ? "Not started"
          : t(`travel_desk_travel_request.status.${travelDeskTravelRequest.status}`, {
              $default: travelDeskTravelRequest.status,
            }),
      travelDeskOfficer: travelDeskTravelRequest.travelDeskOfficer
        ? travelDeskTravelRequest.travelDeskOfficer
        : "",
    }
  })
  const options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: false,
    title: "",
    filename: "Travel-Desk-Requests",
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: [
      "Submit Date",
      "Name",
      "Department",
      "Branch",
      "Travel Start Date",
      "Travel End Date",
      "Location",
      "Requested",
      "Status",
      "Travel Desk Officer",
    ],
  }
  const csvExporter = new ExportToCsv(options)
  csvExporter.generateCsv(csvInfo)
}

function getLocationName(stops) {
  const names = []
  const destinations = store.state.traveldesk.destinations

  for (const stop of stops) {
    const location = destinations.filter((dest) => dest.value == stop.locationId)
    if (location.length > 0) {
      names.push(location[0].text)
    }
  }

  return names.join(", ")
}

function getRequested(item) {
  const requested = []
  if (item.flightRequests?.length > 0) requested.push("flight")
  if (item.hotels?.length > 0) requested.push("hotel")
  if (item.rentalCars?.length > 0) requested.push("rental car")
  if (item.otherTransportations?.length > 0) requested.push("transportation")

  return requested.join(", ")
}
</script>
