<template>
  <PageLoader v-if="isLoadingTravelAuthorization" />
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
import { computed } from "vue"

import useTravelAuthorization from "@/use/use-travel-authorization"

import Breadcrumbs from "@/components/Breadcrumbs"
import PageLoader from "@/components/PageLoader"
import SummaryHeaderPanel from "@/components/travel-authorizations/SummaryHeaderPanel.vue"
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

const { travelAuthorization, isLoading: isLoadingTravelAuthorization } = useTravelAuthorization(
  props.travelAuthorizationId
)
const travelAuthorizationUser = computed(() => travelAuthorization.value?.user)
</script>
