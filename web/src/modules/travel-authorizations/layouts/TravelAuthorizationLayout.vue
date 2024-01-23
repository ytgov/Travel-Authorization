<template>
  <v-layout
    v-if="isLoadingTravelAuthorization"
    fill-height
    align-center
    justify-center
    class="min-vh-70"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    />
  </v-layout>
  <div v-else>
    <Breadcrumbs />

    <h1>
      Travel -
      <VUserChipMenu :user-id="travelAuthorizationUser.id" />
    </h1>

    <SummaryHeaderPanel :travel-authorization-id="travelAuthorizationId" />

    <v-tabs>
      <DetailsTab :travel-authorization-id="travelAuthorizationId" />
      <EstimateTab :travel-authorization-id="travelAuthorizationId" />
      <ExpenseTab :travel-authorization-id="travelAuthorizationId" />
      <!-- TODO: add in any tabs that you can normally see in manage mode -->
    </v-tabs>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { computed, watch } from "vue"

import useTravelAuthorization from "@/use/travel-authorization"

import Breadcrumbs from "@/components/Breadcrumbs"
import SummaryHeaderPanel from "@/modules/travel-authorizations/components/SummaryHeaderPanel"
import VUserChipMenu from "@/components/VUserChipMenu"

import DetailsTab from "@/modules/travel-authorizations/components/travel-authorization-layout/DetailsTab"
import EstimateTab from "@/modules/travel-authorizations/components/travel-authorization-layout/EstimateTab"
import ExpenseTab from "@/modules/travel-authorizations/components/travel-authorization-layout/ExpenseTab"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const {
  travelAuthorization,
  isLoading: isLoadingTravelAuthorization,
  fetch: fetchTravelAuthorization,
} = useTravelAuthorization(props.travelAuthorizationId)
const travelAuthorizationUser = computed(() => travelAuthorization.value?.user)

watch(
  () => props.travelAuthorizationId,
  async () => {
    await fetchTravelAuthorization()
  },
  { immediate: true }
)
</script>
