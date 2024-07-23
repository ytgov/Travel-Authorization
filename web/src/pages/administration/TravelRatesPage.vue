<template>
  <v-container>
    <h2 class="d-flex justify-space-between align-center">
      Meals and Incidental Expenses for Employees on Travel Status
      <v-btn
        class="primary"
        :to="{ name: 'administration/TravelRatesEditPage' }"
        >Edit</v-btn
      >
    </h2>

    <FullDayPerDiemsCard />
    <PartialDaysPerDiemsCard class="mt-6" />

    <v-card class="mt-6">
      <v-card-title><h3>Incidental expenses</h3></v-card-title>
      <IncidentalPerDiemsDataTable />
    </v-card>

    <PrivateVehicleTravelAllowanceCard class="mt-6" />
    <NonCommercialAccommodationTravelAllowanceCard class="mt-6" />
  </v-container>
</template>

<script setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

import FullDayPerDiemsCard from "@/components/per-diems/FullDayPerDiemsCard.vue"
import PartialDaysPerDiemsCard from "@/components/per-diems/PartialDaysPerDiemsCard.vue"
import IncidentalPerDiemsDataTable from "@/components/per-diems/IncidentalPerDiemsDataTable.vue"
import PrivateVehicleTravelAllowanceCard from "@/components/travel-allowances/PrivateVehicleTravelAllowanceCard.vue"
import NonCommercialAccommodationTravelAllowanceCard from "@/components/travel-allowances/NonCommercialAccommodationTravelAllowanceCard.vue"

useBreadcrumbs([
  {
    text: "Administration",
    to: { name: "AdministrationPage" },
  },
  {
    text: "Travel Rates",
    to: { name: "administration/TravelRatesPage" },
  },
])
</script>
