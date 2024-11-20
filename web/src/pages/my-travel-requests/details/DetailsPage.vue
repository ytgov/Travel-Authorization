<template>
  <div class="mt-4">
    <v-row>
      <v-col>
        <PurposeCard :travel-authorization-id="travelAuthorizationIdAsNumber" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DetailsCard :travel-authorization-id="travelAuthorizationIdAsNumber" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ApprovalsCard :travel-authorization-id="travelAuthorizationIdAsNumber" />
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <v-btn
        color="secondary"
        :to="{ name: 'MyTravelAuthorizationsPage' }"
        >Back</v-btn
      >
      <RevertToDraftButton
        :travel-authorization-id="travelAuthorizationIdAsNumber"
        class="ml-3"
        classes-for-disabled-button="ml-3"
        color="warning"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useTravelAuthorization from "@/use/use-travel-authorization"

import RevertToDraftButton from "@/components/travel-authorizations/RevertToDraftButton.vue"

import PurposeCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/PurposeCard"
import DetailsCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/DetailsCard"
import ApprovalsCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/ApprovalsCard"

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const breadcrumbs = computed(() => [
  {
    text: "My Travel Requests",
    to: {
      name: "MyTravelAuthorizationsPage",
    },
  },
  {
    text: travelAuthorization.value?.eventName || "loading ...",
    to: {
      name: "my-travel-requests/details/DetailsPage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
  },
])
useBreadcrumbs(breadcrumbs)
</script>
