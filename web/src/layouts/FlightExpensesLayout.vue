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

      <router-view
        :start-date="startDate"
        :end-date="endDate"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue"
import { DateTime } from "luxon"
import { isEmpty } from "lodash"

import useRouteQuery, { jsonTransformer } from "@/use/utils/use-route-query"

import DatePickerRangeDialog from "@/components/common/DatePickerRangeDialog.vue"

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
</script>
