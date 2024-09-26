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
        <ApprovalsCard :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <v-btn
        color="secondary"
        :to="{ name: 'MyTravelAuthorizationsPage' }"
        >Back</v-btn
      >
      <RevertToDraftButton
        :travel-authorization-id="travelAuthorizationId"
        class="ml-3"
        color="warning"
      />
    </div>
  </div>
</template>

<script setup>
import RevertToDraftButton from "@/components/travel-authorizations/RevertToDraftButton.vue"

import PurposeCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/PurposeCard"
import DetailsCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/DetailsCard"
import ApprovalsCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/ApprovalsCard"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})
</script>
