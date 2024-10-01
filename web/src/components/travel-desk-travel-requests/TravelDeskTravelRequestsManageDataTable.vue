<template>
  <div>
    <div class="d-flex mb-4">
      <v-spacer />
      <print-travel-desk-report
        class="my-0 mr-4"
        :disabled="selectedRequests.length == 0"
        :travel-desk-requests="selectedRequests"
        button-name="Print Report"
        @update="getTravelDeskRequests"
      />
      <ExportToCsvButton
        :travel-desk-travel-request-ids="selectedRequests.map((request) => request.id)"
        :disabled="isNil(selectedRequests) || isEmpty(selectedRequests)"
        class="my-0"
        color="primary"
      >
        Export To Excel
      </ExportToCsvButton>
    </div>

    <v-data-table
      v-model="selectedRequests"
      :headers="headers"
      :items="travelDeskRequests"
      :sort-by="['bookedStatus', 'userTravel', 'startDate']"
      :sort-desc="[false, true, false]"
      :item-class="itemRowBackground"
      multi-sort
      :items-per-page="15"
      show-select
      item-key="id"
    >
      <template #item.createdAt="{ item }">
        <div>
          {{ item.createdAt | beautifyDate }}
        </div>
      </template>

      <template #item.fullname="{ item }">
        {{ [item.legalFirstName, item.legalLastName].filter(Boolean).join(" ") || "Unknown" }}
      </template>

      <template #item.department="{ item }">
        {{ item.travelAuthorization.department }}
      </template>

      <template #item.branch="{ item }">
        {{ item.travelAuthorization.branch }}
      </template>

      <template #item.startDate="{ item }">
        <div>
          {{ item.startDate | beautifyDate }}
        </div>
      </template>

      <template #item.endDate="{ item }">
        <div>
          {{ item.travelAuthorization.dateBackToWork | beautifyDate }}
        </div>
      </template>

      <template #item.location="{ item }">
        {{ getLocationName(item.travelAuthorization.stops) }}
      </template>

      <template #item.requested="{ item }">
        {{ getRequested(item) }}
      </template>

      <template #item.status="{ item, value }">
        <div v-if="value == 'submitted' && !item.travelDeskOfficer">
          Not started <v-icon class="red--text">mdi-flag</v-icon>
        </div>
        <div v-else>
          {{ t(`travel_desk_travel_request.status.${value}`, { $default: value }) }}
          <v-icon
            v-if="value == 'submitted'"
            class="red--text"
            >mdi-flag</v-icon
          >
          <v-icon
            v-if="value == 'options_ranked'"
            class="yellow--text"
            >mdi-flag</v-icon
          >
          <v-icon
            v-else-if="value == 'booked'"
            class="green--text"
            >mdi-checkbox-marked</v-icon
          >
        </div>
      </template>

      <template #item.edit="{ item }">
        <ProcessTravelDeskRequest
          class="pr-2"
          :type="item.status == 'booked' ? 'booked' : 'edit'"
          :travel-detail="item"
          @update-table="getTravelDeskRequests"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useStore } from "vue2-helpers/vuex"
import { isNil, isEmpty } from "lodash"

import { useI18n } from "@/plugins/vue-i18n-plugin"
import { TRAVEL_DESK_URL, USERS_URL } from "@/urls"
import http from "@/api/http-client"
import locationsApi from "@/api/locations-api"

import ExportToCsvButton from "@/components/travel-desk-travel-requests/ExportToCsvButton.vue"
import ProcessTravelDeskRequest from "@/modules/travelDesk/views/Desk/ProcessTravelDeskRequest.vue"
import PrintTravelDeskReport from "@/modules/travelDesk/views/Common/PrintTravelDeskReport.vue"

const { t } = useI18n()
const store = useStore()

const travelDeskRequests = ref([])
const selectedRequests = ref([])
const loadingData = ref(false)
const department = ref("")
const alertMsg = ref("")

const headers = ref([
  { text: "Submit Date", value: "createdAt" },
  { text: "Name", value: "fullname", sortable: false },
  { text: "Department", value: "department" },
  { text: "Branch", value: "branch" },
  { text: "Travel Start Date", value: "startDate" },
  {
    text: "Travel End Date",
    value: "endDate",
    sortable: false,
  },
  { text: "Location", value: "location" },
  { text: "Requested", value: "requested" },
  { text: "Status", value: "status" },
  { text: "Travel Desk Officer", value: "travelDeskOfficer" },
  {
    text: "",
    value: "edit",
    cellClass: "px-0 mx-0",
    sortable: false,
  },
])

onMounted(async () => {
  loadingData.value = true
  department.value = store.state.auth.department
  await getDestinations()
  await getTravelDeskUsers()
  await getTravelDeskRequests()
  loadingData.value = false
})

async function getDestinations() {
  const { locations } = await locationsApi.list()
  const formattedLocations = locations.map(({ id, city, province }) => {
    return {
      value: id,
      text: `${city} (${province})`,
      city,
      province,
    }
  })
  store.commit("traveldesk/SET_DESTINATIONS", formattedLocations)
  return formattedLocations
}

async function getTravelDeskUsers() {
  try {
    const { data } = await http.get(`${USERS_URL}/travel-desk-users`)
    store.commit("traveldesk/SET_TRAVEL_DESK_USERS", data)
  } catch (error) {
    alertMsg.value = error.response.data
  }
}

async function getTravelDeskRequests() {
  try {
    const { data } = await http.get(`${TRAVEL_DESK_URL}/`)
    travelDeskRequests.value = data
    travelDeskRequests.value.forEach((travelDeskRequest) => {
      travelDeskRequest.userTravel =
        store.state.auth.fullName == travelDeskRequest.travelDeskOfficer ? 1 : 0
      travelDeskRequest.bookedStatus = travelDeskRequest.status == "booked" ? 1 : 0
      travelDeskRequest.startDate = getStartDate(
        travelDeskRequest.travelAuthorization.dateBackToWork,
        travelDeskRequest.travelAuthorization.travelDuration
      )
    })
  } catch (error) {
    console.log(error)
  }
}

function getStartDate(endDate, travelDuration) {
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 1 * Number(travelDuration))
  return startDate.toISOString()
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

function itemRowBackground(item) {
  return item.userTravel > 0 ? "red lighten-5" : ""
}
</script>

<style scoped>
::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
