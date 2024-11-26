<template>
  <div class="mt-4">
    <v-row>
      <v-col>
        <h3>Traveler Expenses</h3>
        <ExpensesTable :travel-authorization-id="travelAuthorizationIdAsNumber" />
        * Meals and Incidentals are not included in this table.
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Meals and Incidentals</h3>
        <MealsAndIncidentalsTable :travel-authorization-id="travelAuthorizationIdAsNumber" />
      </v-col>
      <v-col>
        <h3>Totals</h3>
        <TotalsTable
          :travel-authorization-id="travelAuthorizationIdAsNumber"
          class="white"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Coding</h3>
        <GeneralLedgerCodingsTable :travel-authorization-id="travelAuthorizationIdAsNumber" />
      </v-col>
      <v-col cols="4"></v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, toRefs } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useTravelAuthorization from "@/use/use-travel-authorization"

import ExpensesTable from "@/modules/travel-authorizations/components/read-travel-authorization-expense-page/ExpensesTable"
import GeneralLedgerCodingsTable from "@/modules/travel-authorizations/components/read-travel-authorization-expense-page/GeneralLedgerCodingsTable"
import MealsAndIncidentalsTable from "@/modules/travel-authorizations/components/read-travel-authorization-expense-page/MealsAndIncidentalsTable"
import TotalsTable from "@/modules/travel-authorizations/components/read-travel-authorization-expense-page/TotalsTable"

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const breadcrumbs = computed(() => [
  {
    text: "My Travel Requests",
    to: {
      name: "my-travel-requests/MyTravelRequestsPage",
    },
  },
  {
    text: travelAuthorization.value?.eventName || "loading ...",
    to: {
      name: "my-travel-requests/expense/ExpensePage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
  },
])
useBreadcrumbs(breadcrumbs)
</script>
