<template>
  <v-card
    class="mt-5"
    color="#fff2d5"
  >
    <v-card-title>
      Approved Trips
      <RefreshTableButton @click="refreshTable" />
    </v-card-title>
    <v-card-text>
      <TravelAuthorizationsSupervisorDataTable
        ref="travelAuthorizationsSupervisorDataTable"
        :where="whereClause"
        route-query-suffix="ApprovedTrips"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from "vue"

import { STATUSES } from "@/api/travel-authorizations-api"

import TravelAuthorizationsSupervisorDataTable from "@/components/travel-authorizations/manage/TravelAuthorizationsSupervisorDataTable.vue"
import RefreshTableButton from "@/components/travel-authorizations/RefreshTableButton.vue"

const whereClause = {
  status: STATUSES.APPROVED,
}

const travelAuthorizationsSupervisorDataTable = ref(null)

function refreshTable() {
  travelAuthorizationsSupervisorDataTable.value?.refresh()
}
</script>
