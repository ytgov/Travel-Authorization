<template>
  <v-data-table
    v-model="selectedRequests"
    :page.sync="page"
    :items-per-page.sync="perPage"
    :headers="headers"
    :items="travelDeskTravelRequests"
    :server-items-length="totalCount"
    :loading="isLoading"
    :sort-by="['isBooked', 'isAssignedToCurrentUser', 'travelStartDate']"
    :sort-desc="[false, true, false]"
    :item-class="itemRowBackground"
    multi-sort
    show-select
  >
    <template #top>
      <div class="d-flex mb-4">
        <v-spacer />
        <PrintTravelDeskReport
          :travel-desk-travel-request-ids="selectedRequests.map((request) => request.id)"
          :activator-props="{
            class: 'my-0 mr-4',
            color: 'primary',
            disabled: isNil(selectedRequests) || isEmpty(selectedRequests),
          }"
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
    </template>
    <template #item.createdAt="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #item.userDisplayName="{ value }">
      {{ value }}
    </template>

    <template #item.department="{ value }">
      {{ value }}
    </template>

    <template #item.branch="{ value }">
      {{ value }}
    </template>

    <template #item.travelStartDate="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #item.travelEndDate="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #item.locationsTraveled="{ value }">
      {{ value }}
    </template>

    <template #item.requested="{ item }">
      {{ determineRequestedOptions(item) }}
    </template>

    <template #item.status="{ item, value }">
      <template
        v-if="
          (value === TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.SUBMITTED &&
            isNil(item.travelDeskOfficer)) ||
          isEmpty(item.travelDeskOfficer)
        "
      >
        Not started <v-icon class="red--text">mdi-flag</v-icon>
      </template>
      <template v-else>
        {{ t(`travel_desk_travel_request.status.${value}`, { $default: value }) }}
        <v-icon
          v-if="value === TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.SUBMITTED"
          class="red--text"
          >mdi-flag</v-icon
        >
        <v-icon
          v-else-if="value === TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.OPTIONS_RANKED"
          class="yellow--text"
          >mdi-flag</v-icon
        >
        <v-icon
          v-else-if="value === TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.BOOKED"
          class="green--text"
          >mdi-checkbox-marked</v-icon
        >
      </template>
    </template>

    <template #item.edit="{ item }">
      <v-btn
        color="primary"
        :to="{
          name: 'TravelDeskEditPage',
          params: {
            travelDeskTravelRequestId: item.id,
          },
        }"
      >
        <v-icon
          left
          dark
        >
          mdi-pencil
        </v-icon>
        Edit
      </v-btn>
    </template>
  </v-data-table>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useStore } from "vue2-helpers/vuex"
import { isNil, isEmpty } from "lodash"

import { useI18n } from "@/plugins/vue-i18n-plugin"
import { USERS_URL } from "@/urls"
import formatDate from "@/utils/format-date"
import { integerTransformer } from "@/utils/use-route-query-transformers"
import http from "@/api/http-client"
import locationsApi from "@/api/locations-api"

import useRouteQuery from "@/use/use-route-query"
import useTravelDeskTravelRequests, {
  TRAVEL_DESK_TRAVEL_REQUEST_STATUSES,
} from "@/use/use-travel-desk-travel-requests"

import ExportToCsvButton from "@/components/travel-desk-travel-requests/ExportToCsvButton.vue"
import PrintTravelDeskReport from "@/modules/travelDesk/views/Common/PrintTravelDeskReport.vue"

const headers = ref([
  { text: "Submit Date", value: "createdAt" },
  { text: "Name", value: "userDisplayName", sortable: false },
  { text: "Department", value: "department" },
  { text: "Branch", value: "branch" },
  { text: "Travel Start Date", value: "travelStartDate" },
  { text: "Travel End Date", value: "travelEndDate", sortable: false },
  { text: "Locations Traveled", value: "locationsTraveled" },
  { text: "Requested", value: "requested" },
  { text: "Status", value: "status" },
  { text: "Travel Desk Officer", value: "travelDeskOfficer" },
  { text: "", value: "edit", cellClass: "px-0 mx-0", sortable: false },
])

const { t } = useI18n()
const store = useStore()

const page = useRouteQuery("page", "1", { transform: integerTransformer })
const perPage = useRouteQuery("perPage", "15", { transform: integerTransformer })

const travelDeskTravelRequestsQuery = computed(() => {
  return {
    page: page.value,
    perPage: perPage.value,
  }
})
const {
  travelDeskTravelRequests,
  totalCount,
  isLoading: isLoadingTravelDeskTravelRequests,
} = useTravelDeskTravelRequests(travelDeskTravelRequestsQuery)

const selectedRequests = ref([])
const isLoadingDestinationsAndTravelDeskUsers = ref(false)
const alertMsg = ref("")

const isLoading = computed(
  () => isLoadingTravelDeskTravelRequests.value || isLoadingDestinationsAndTravelDeskUsers.value
)

onMounted(async () => {
  isLoadingDestinationsAndTravelDeskUsers.value = true
  await getDestinations()
  await getTravelDeskUsers()
  isLoadingDestinationsAndTravelDeskUsers.value = false
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

function itemRowBackground(item) {
  return item.isAssignedToCurrentUser > 0 ? "red lighten-5" : ""
}
</script>

<style scoped>
::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
