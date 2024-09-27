<template>
  <v-container>
    <h1>Travel Desk</h1>

    <v-card class="default">
      <v-card-text>
        <TravelDeskRequests />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

import TravelDeskRequests from "@/modules/travelDesk/views/Desk/TravelDeskRequests.vue"

useBreadcrumbs([
  {
    text: "Travel Desk",
    to: {
      name: "TravelDeskPage",
    },
  },
])
</script>
