<template>
  <div class="mt-4">
    <v-row>
      <v-col>
        <PurposeCard :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DetailsCard :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ApprovalsCard
          ref="approvalsCard"
          :travel-authorization-id="travelAuthorizationId"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ManagementCard
          :travel-authorization-id="travelAuthorizationId"
          @approved="refresh"
          @denied="refresh"
          @re-assigned="refresh"
        />
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <v-btn
        class="ml-3"
        color="secondary"
        :to="{ name: 'ManageTravelAuthorizationsPage' }"
        >Back</v-btn
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

import PurposeCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/PurposeCard"
import DetailsCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/DetailsCard"
import ApprovalsCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/ApprovalsCard"

import ManagementCard from "@/modules/travel-authorizations/components/manage-travel-authorization-details-page/ManagementCard"

defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

/** @type {import('vue').Ref<InstanceType<typeof ApprovalsCard> | null>} */
const approvalsCard = ref(null)

function refresh() {
  approvalsCard.value.refresh()
}
</script>
