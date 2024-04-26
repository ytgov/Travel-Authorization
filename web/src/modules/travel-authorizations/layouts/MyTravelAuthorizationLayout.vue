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
            <template
              v-for="({ component, tabName, props: componentProps }, index) in availableTabs"
            >
              <component
                :is="component"
                :key="index"
                v-bind="componentProps"
                >{{ tabName }}</component
              >
            </template>
          </v-tabs>
        </div>

        <router-view @state-changed="refreshTabs"></router-view>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, toRefs, computed, watch, defineAsyncComponent } from "vue"
import { isNil } from "lodash"

import { TRAVEL_METHODS } from "@/api/travel-segments-api"
import useCurrentUser from "@/use/use-current-user"
import useTravelAuthorization, {
  STATUSES as TRAVEL_AUTHORIZATION_STATUSES,
} from "@/use/use-travel-authorization"

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
const { travelAuthorization, policy } = useTravelAuthorization(travelAuthorizationId)

/** @type {import("vue").Ref<InstanceType<typeof RequestTab> | null>} */
const requestTab = ref(null)

function refreshTabs() {
  requestTab.value?.refresh()
}
const VTabsComponent = defineAsyncComponent(() => import("vuetify/lib"))
const LockedTab = defineAsyncComponent(() => import("@/components/common/LockedTab"))

const detailsTabComponentName = computed(() => {
  if (policy.value?.update) {
    return "EditMyTravelAuthorizationDetailsPage"
  }

  return "ReadMyTravelAuthorizationDetailsPage"
})

const estimateTabComponentName = computed(() => {
  if (policy.value?.update) {
    return "EditMyTravelAuthorizationEstimatePage"
  }

  return "ReadMyTravelAuthorizationEstimatePage"
})

const requestTabComponent = computed(() => {
  // TODO: lock on denied states.
  const isWaitingForApproval =
    travelAuthorization.value.status === TRAVEL_AUTHORIZATION_STATUSES.DRAFT ||
    travelAuthorization.value.status === TRAVEL_AUTHORIZATION_STATUSES.SUBMITTED
  const hasNoAirTravel = travelAuthorization.value.travelSegments.every(
    (segment) => segment.modeOfTransport !== TRAVEL_METHODS.AIRCRAFT
  )
  const isLocked = isWaitingForApproval || hasNoAirTravel

  const lockReasons = []
  if (isWaitingForApproval) {
    lockReasons.push("Travel authorization is waiting for approval.")
  }

  if (hasNoAirTravel) {
    lockReasons.push("Disabled as traveler is not traveling by air.")
  }

  if (isLocked === true) {
    return {
      component: LockedTab,
      tabName: "Request",
      props: {
        lockReasons,
      },
    }
  }

  let requestTabComponentName = "MyTravelRequestsRequestReadPage"
  if (policy.value?.update) {
    requestTabComponentName = "MyTravelRequestsRequestEditPage"
  }

  return {
    component: VTabsComponent,
    tabName: "Request",
    props: {
      to: {
        name: requestTabComponentName,
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
    },
  }
})

const availableTabs = computed(() => [
  {
    component: VTabsComponent,
    tabName: "Details",
    props: {
      to: {
        name: detailsTabComponentName,
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
    },
  },
  {
    component: VTabsComponent,
    tabName: "Estimate",
    props: {
      to: {
        name: estimateTabComponentName,
        params: { travelAuthorizationId: travelAuthorizationId.value },
      },
    },
  },
  requestTabComponent.value,
  {
    name: "Expense",
    component: ExpenseTab,
  },
])

watch(
  () => availableTabs.value,
  (newTabs) => {
    console.log("newTabs:", newTabs)
  }
)
</script>
