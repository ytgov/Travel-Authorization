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
      <v-btn
        :loading="isLoading"
        class="ml-3"
        color="warning"
        @click="revertToDraftAndRedirect"
      >
        Revert to Draft
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

import { useSnack } from "@/plugins/snack-plugin"
import travelAuthorizationApi from "@/api/travel-authorizations-api"

import PurposeCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/PurposeCard"
import DetailsCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/DetailsCard"
import ApprovalsCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/ApprovalsCard"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const isLoading = ref(false)
const snack = useSnack()

async function revertToDraftAndRedirect() {
  isLoading.value = true
  try {
    await travelAuthorizationApi.revertToDraft(props.travelAuthorizationId)
    return router.push({
      name: "EditMyTravelAuthorizationDetailsPage",
      params: {
        travelAuthorizationId: props.travelAuthorizationId,
      },
    })
  } catch (error) {
    console.error(error)
    snack(`Failed to revert to draft: ${error}`, {
      color: "error",
    })
  } finally {
    isLoading.value = false
  }
}
</script>
