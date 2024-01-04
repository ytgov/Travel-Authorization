<template>
  <div class="mt-4">
    <v-row>
      <v-col>
        <h3>Traveler Expenses</h3>

        <ExpensesTable :travel-authorization-id="travelAuthorizationId" />
        * Meals and Incidentals are not included in this table.
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Meals and Incidentals</h3>
        <MealsAndIncidentalsTable :travel-authorization-id="travelAuthorizationId" />
      </v-col>
      <v-col>
        <h3>Totals</h3>
        <TotalsTable :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
    <!-- TODO: add the rest of the components -->
    <v-row>
      <v-col>
        <TravelAuthorizationActionLogsTable :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import ExpensesTable from "@/modules/travel-authorizations/components/read-travel-authorization-expense-page/ExpensesTable"
import MealsAndIncidentalsTable from "@/modules/travel-authorizations/components/read-travel-authorization-expense-page/MealsAndIncidentalsTable"
import TotalsTable from "@/modules/travel-authorizations/components/read-travel-authorization-expense-page/TotalsTable"
import TravelAuthorizationActionLogsTable from "@/modules/travel-authorizations/components/TravelAuthorizationActionLogsTable"

defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})
// Do some stuff here
</script>
