<template>
  <v-container>
    <h1>Travel Desk</h1>

    <v-card class="default">
      <v-card-text>
        <TravelDeskTravelRequestsManageDataTable />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

import TravelDeskTravelRequestsManageDataTable from "@/components/travel-desk-travel-requests/TravelDeskTravelRequestsManageDataTable.vue"

useBreadcrumbs([
  {
    text: "Travel Desk",
    to: {
      name: "TravelDeskPage",
    },
  },
])
</script>
