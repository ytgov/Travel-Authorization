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
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-if="isAdmin"
            color="primary"
            v-bind="attrs"
            v-on="on"
            @click="goToAdminEditPage"
          >
            Edit
            <v-icon
              small
              right
            >
              mdi-help-circle-outline
            </v-icon>
          </v-btn>
        </template>
        <span>You can edit this because you are an admin.</span>
      </v-tooltip>
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
import { useRouter } from "vue2-helpers/vue-router"

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

const router = useRouter()
const { isAdmin } = useCurrentUser()
const { travelAuthorization, isLoading: isLoadingTravelAuthorization } = useTravelAuthorization(
  props.travelAuthorizationId
)
const travelAuthorizationUser = computed(() => travelAuthorization.value?.user)

function goToAdminEditPage() {
  router.push({
    name: "EditTravelAuthorizationDetailsPage",
    params: { travelAuthorizationId: props.travelAuthorizationId },
  })
}
</script>
