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
    ></v-progress-circular>
  </v-layout>
  <div v-else>
    <Breadcrumbs />

    <h1 class="d-flex justify-space-between">
      <span>
        Travel -
        <VUserChipMenu :user-id="travelAuthorizationUser.id" />
      </span>
      <v-btn
        v-if="isAdmin"
        color="primary"
        @click="goToAdminEditPage"
      >
        Edit
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              small
              class="ml-2"
              v-bind="attrs"
              v-on="on"
            >
              mdi-help-circle-outline
            </v-icon>
          </template>
          <span>You can edit this because you are an admin.</span>
        </v-tooltip>
      </v-btn>
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

import useCurrentUser from "@/use/use-current-user"
import useTravelAuthorization from "@/use/travel-authorization"

import Breadcrumbs from "@/components/Breadcrumbs"
import SummaryHeaderPanel from "@/modules/travel-authorizations/components/SummaryHeaderPanel"
import VUserChipMenu from "@/components/VUserChipMenu"

import DetailsTab from "@/modules/travel-authorizations/components/manage-travel-authorization-layout/DetailsTab"
import EstimateTab from "@/modules/travel-authorizations/components/manage-travel-authorization-layout/EstimateTab"
import ExpenseTab from "@/modules/travel-authorizations/components/manage-travel-authorization-layout/ExpenseTab"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { isAdmin } = useCurrentUser()
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

function goToAdminEditPage() {
  alert(
    `TODO: redirect user to admin edit interface for TravelAuthorization#${props.travelAuthorizationId}`
  )
}
</script>
