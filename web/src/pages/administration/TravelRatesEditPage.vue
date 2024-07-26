<template>
  <v-container>
    <h2>Edit Meals and Incidental Expenses for Employees on Travel Status</h2>

    <EditPerDiemsCard />
    <EditTravelAllowancesCard class="mt-6" />
  </v-container>
</template>

<script setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

import EditPerDiemsCard from "@/components/per-diems/EditPerDiemsCard.vue"
import EditTravelAllowancesCard from "@/components/travel-allowances/EditTravelAllowancesCard.vue"

useBreadcrumbs([
  {
    text: "Administration",
    to: { name: "AdministrationPage" },
  },
  {
    text: "Travel Rates",
    to: { name: "administration/TravelRatesPage" },
  },
  {
    text: "Edit",
    to: { name: "administration/TravelRatesEditPage" },
  },
])
</script>
