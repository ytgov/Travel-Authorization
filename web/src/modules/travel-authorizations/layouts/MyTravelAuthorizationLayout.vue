<template>
  <PageLoader v-if="isNil(travelAuthorization.id)" />
  <div v-else>
    <Breadcrumbs />

    <div class="d-flex justify-space-between align-baseline my-5">
      <h1>
        Travel -
        <VUserChipMenu :user-id="currentUser.id" />
      </h1>
    </div>

    <v-card class="default">
      <v-card-text>
        <SummaryHeaderPanel :travel-authorization-id="travelAuthorizationId" />

        <div style="border: 1px #ddd solid">
          <v-tabs>
            <!-- TODO: investigate if I should refresh other tabs -->
            <DetailsTab :travel-authorization-id="travelAuthorizationId" />
            <EstimateTab :travel-authorization-id="travelAuthorizationId" />
            <RequestTab
              ref="requestTab"
              :travel-authorization-id="travelAuthorizationId"
            />
            <ExpenseTab :travel-authorization-id="travelAuthorizationId" />
            <!-- TODO: add in any tabs that you can normally see in read-only mode -->
          </v-tabs>
        </div>

        <router-view @state-changed="refreshTabs"></router-view>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, toRefs } from "vue"
import { isNil } from "lodash"

import useCurrentUser from "@/use/use-current-user"
import useTravelAuthorization from "@/use/use-travel-authorization"

import Breadcrumbs from "@/components/Breadcrumbs"
import PageLoader from "@/components/PageLoader"
import SummaryHeaderPanel from "@/modules/travel-authorizations/components/SummaryHeaderPanel"
import VUserChipMenu from "@/components/VUserChipMenu"

import DetailsTab from "@/modules/travel-authorizations/components/my-travel-authorization-layout/DetailsTab"
import EstimateTab from "@/modules/travel-authorizations/components/my-travel-authorization-layout/EstimateTab"
import ExpenseTab from "@/modules/travel-authorizations/components/my-travel-authorization-layout/ExpenseTab"
import RequestTab from "@/modules/travel-authorizations/components/my-travel-authorization-layout/RequestTab"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { currentUser } = useCurrentUser()

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

/** @type {import("vue").Ref<InstanceType<typeof RequestTab> | null>} */
const requestTab = ref(null)

function refreshTabs() {
  requestTab.value?.refresh()
}
</script>
