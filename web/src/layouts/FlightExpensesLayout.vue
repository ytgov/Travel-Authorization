<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <h2 class="mb-md-0">Flight Expenses</h2>
      <v-row class="d-flex align-center">
        <v-spacer />
        <v-col
          cols="12"
          md="4"
        >
          <DatePickerRangeDialog
            v-model="dateRange"
            label="Records date range"
            :activator-props="{
              outlined: true,
              dense: true,
              hideDetails: true,
            }"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-btn
            v-if="isEmpty(dateRange)"
            class="my-0"
            color="primary"
            block
            primary
            @click="resetDateRange"
          >
            <v-icon
              small
              left
              >mdi-refresh</v-icon
            >
            Reset
          </v-btn>
          <v-btn
            v-else
            class="my-0"
            color="primary"
            block
            primary
            @click="clearDateRange"
          >
            <v-icon
              small
              left
              >mdi-close</v-icon
            >
            Clear
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-tabs
        active-class="primary--text teal lighten-5"
        show-arrows
      >
        <v-tab
          :to="{
            name: 'flight-expenses/AllFlightExpensesPage',
          }"
        >
          All
        </v-tab>
        <v-tab
          :to="{
            name: 'flight-expenses/UnreconciledFlightExpensesPage',
          }"
        >
          Unreconciled
        </v-tab>
        <v-tab
          :to="{
            name: 'flight-expenses/ReconciledFlightExpensesPage',
          }"
        >
          Reconciled
        </v-tab>
      </v-tabs>

      <v-alert
        v-if="alertMsg"
        dense
        class="mt-5"
        color="warning"
        dismissible
        >{{ alertMsg }}</v-alert
      >

      <!-- TODO: make each tab load its own data via composable -->
      <router-view
        :start-date="startDate"
        :end-date="endDate"
        :un-reconciled-flights="unReconciledFlights"
        :reconciled-flights="reconciledFlights"
        @updateTable="refresh"
      ></router-view>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { DateTime } from "luxon"
import { isEmpty } from "lodash"

import http from "@/api/http-client"
import { TRAVEL_COM_URL } from "@/urls"
import useRouteQuery, { jsonTransformer } from "@/use/utils/use-route-query"

import DatePickerRangeDialog from "@/components/common/DatePickerRangeDialog.vue"

const flights = ref([])
const reconciledFlights = computed(() => flights.value.filter((flight) => flight.reconciled))
const unReconciledFlights = computed(() => flights.value.filter((flight) => !flight.reconciled))

const alertMsg = ref("")

const isLoading = ref(false)

const INTIAL_DATE_RANGE = [
  DateTime.local().toISODate(),
  DateTime.local().minus({ days: 1 }).toISODate(),
]
const INTIAL_DATE_RANGE_AS_STRING = JSON.stringify(INTIAL_DATE_RANGE)

const dateRange = useRouteQuery("dateRange", INTIAL_DATE_RANGE_AS_STRING, {
  transform: jsonTransformer,
})

const startDate = computed(() => dateRange.value[0])
const endDate = computed(() => dateRange.value[1])

function clearDateRange() {
  dateRange.value = []
}

function resetDateRange() {
  dateRange.value = INTIAL_DATE_RANGE
}

onMounted(async () => {
  await getFlights()
})

async function getFlights() {
  isLoading.value = true
  try {
    // Remove this hack once we are using the non-legacy endpoint.
    let dateRangeParams
    if (!isEmpty(dateRange.value)) {
      dateRangeParams = `${startDate.value}/${endDate.value}`
    } else {
      dateRangeParams = `1753-01-01/9999-12-31`
    }

    const { data: newFlights } = await http.get(`${TRAVEL_COM_URL}/flights/${dateRangeParams}`)
    flights.value = newFlights || []
  } catch (error) {
    console.log(`Failed to load flights: ${error}`)
  } finally {
    isLoading.value = false
  }
}

async function refresh() {
  return getFlights()
}
</script>
