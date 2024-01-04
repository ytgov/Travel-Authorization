<template>
  <div>
    TODO: add read-only equivalents of components from
    web/src/modules/travel-authorizations/pages/EditMyTravelAuthorizationExpensePage.vue
    <v-row>
      <v-col>
        <TravelAuthorizationActionLogsTable :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import TravelAuthorizationActionLogsTable from "@/modules/travel-authorizations/components/TravelAuthorizationActionLogsTable"

defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})
// Do some stuff here
</script>
