<template>
  <v-data-table
    :headers="headers"
    :items="travelAuthorizations"
    :loading="isLoading"
    :items-per-page.sync="perPage"
    :page.sync="page"
    :server-items-length="totalCount"
    @click:row="goToMyTravelRequestWizardStep"
  >
    <template #top>
      <DeleteTravelAuthorizationDialog
        ref="deleteDialog"
        @deleted="refresh"
      />
    </template>
    <template #item.phase="{ value }">
      <span>{{ formatPhase(value) }}</span>
    </template>
    <template #item.finalDestination="{ value }">
      <span>{{ formatLocation(value) }}</span>
    </template>
    <template #item.departingAt="{ value }">
      <span>{{ formatDateWrapper(value) }}</span>
    </template>
    <template #item.returningAt="{ value }">
      <span>{{ formatDateWrapper(value) }}</span>
    </template>
    <template #item.status="{ value, item }">
      <span>{{ formatStatus(value, item) }}</span>
    </template>
    <template #item.action="{ value: actions, item }">
      <template v-if="isEmpty(actions)">
        <!-- no action: this is a valid state -->
      </template>
      <v-btn
        v-else-if="actions.includes('delete')"
        class="ml-2"
        color="error"
        @click.stop="showDeleteDialog(item)"
        >Delete</v-btn
      >
      <!-- Add call-to-action for this page: web/src/pages/my-travel-requests/AwaitingRequestBookingPage.vue -->
      <SubmitTravelDeskRequestButton
        v-else-if="actions.includes('submit_travel_desk_request')"
        :travel-authorization-id="item.id"
      />
      <TravelDeskOptionsProvidedButton
        v-else-if="actions.includes('travel_desk_rank_options')"
        :travel-authorization-id="item.id"
      />
      <SubmitExpenseClaimButton
        v-else-if="actions.includes('submit_expense_claim')"
        :travel-authorization-id="item.id"
      />
      <ViewItineraryButton
        v-else-if="actions.includes('view_itinerary')"
        :travel-authorization-id="item.id"
      />
      <AddExpenseButton
        v-else-if="actions.includes('add_expense')"
        :travel-authorization-id="item.id"
      />
      <SubmitPoolVehicleRequestButton
        v-else-if="actions.includes('submit_pool_vehicle_request')"
        :travel-authorization-id="item.id"
      />
      <span v-else> ERROR: unknown actions: {{ actions }}</span>
    </template>
  </v-data-table>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue2-helpers/vue-router"
import { isNil, isEmpty } from "lodash"

import { useI18n } from "@/plugins/vue-i18n-plugin"
import formatDate from "@/utils/format-date"
import useRouteQuery, { integerTransformerLegacy } from "@/use/utils/use-route-query"
import useCurrentUser from "@/use/use-current-user"
import useTravelAuthorizations from "@/use/use-travel-authorizations"

import AddExpenseButton from "@/modules/travel-authorizations/components/my-travel-authorizations-table/AddExpenseButton.vue"
import DeleteTravelAuthorizationDialog from "@/modules/travel-authorizations/components/my-travel-authorizations-table/DeleteTravelAuthorizationDialog.vue"
import TravelDeskOptionsProvidedButton from "@/modules/travel-authorizations/components/my-travel-authorizations-table/TravelDeskOptionsProvidedButton.vue"
import SubmitExpenseClaimButton from "@/modules/travel-authorizations/components/my-travel-authorizations-table/SubmitExpenseClaimButton.vue"
import SubmitPoolVehicleRequestButton from "@/modules/travel-authorizations/components/my-travel-authorizations-table/SubmitPoolVehicleRequestButton.vue"
import SubmitTravelDeskRequestButton from "@/modules/travel-authorizations/components/my-travel-authorizations-table/SubmitTravelDeskRequestButton.vue"
import ViewItineraryButton from "@/modules/travel-authorizations/components/my-travel-authorizations-table/ViewItineraryButton.vue"

const headers = ref([
  {
    text: "Phase",
    value: "phase",
  },
  {
    text: "Location",
    value: "finalDestination",
  },
  {
    text: "Description",
    value: "eventName",
  },
  {
    text: "Start Date",
    value: "departingAt",
  },
  {
    text: "End Date",
    value: "returningAt",
  },
  {
    text: "Travel Auth Status",
    value: "status",
  },
  {
    text: "Travel Action",
    value: "action",
  },
])

const page = useRouteQuery("page", "1", {
  transform: integerTransformerLegacy,
})

const perPage = useRouteQuery("perPage", "10", {
  transform: integerTransformerLegacy,
})

const { currentUser } = useCurrentUser()
const currentUserId = computed(() => currentUser.value.id)

const travelAuthorizationsQuery = computed(() => ({
  where: { userId: currentUserId.value },
  page: page.value,
  perPage: perPage.value,
}))
const { travelAuthorizations, totalCount, isLoading, refresh } =
  useTravelAuthorizations(travelAuthorizationsQuery)

const router = useRouter()

async function goToMyTravelRequestWizardStep(travelAuthorization) {
  const { isDraft, isSubmitted, isTravelDeskOptionsRanked } = travelAuthorization

  const travelAuthorizationId = travelAuthorization.id
  if (isDraft) {
    router.push({
      name: "my-travel-requests/MyTravelRequestWizardPage",
      params: {
        travelAuthorizationId: travelAuthorization.id,
        stepName: travelAuthorization.wizardStepName || "edit-purpose-details",
      },
    })
  } else if (isSubmitted) {
    router.push({
      name: "my-travel-requests/AwaitingApprovalPage",
      params: { travelAuthorizationId },
    })
  } else if (isTravelDeskOptionsRanked) {
    router.push({
      name: "my-travel-requests/AwaitingRequestBookingPage",
      params: { travelAuthorizationId },
    })
  } else {
    router.push({
      name: "my-travel-requests/details/DetailsPage",
      params: { travelAuthorizationId },
    })
  }
}

function formatDateWrapper(value) {
  if (isNil(value)) return "Unknown"

  return formatDate(value, "dd-LLL-yyyy")
}

function formatLocation(value) {
  if (isNil(value) || isNil(value.city)) return "Unknown"

  return value.city
}

const { t } = useI18n()

function formatStatus(value, travelAuthorization) {
  if (travelAuthorization.isTravelling) {
    return t(`global.status.travelling`, { $default: "Unknown" })
  }

  return t(`global.status.${value}`, { $default: "Unknown" })
}

function formatPhase(value) {
  return t(`global.phase.${value}`, { $default: "Unknown" })
}

// TODO: replace this with newer show dialog patterns
onMounted(() => {
  showDeleteDialogForRouteQuery()
})

const route = useRoute()
/** @type {import("vue").Ref<InstanceType<typeof DeleteTravelAuthorizationDialog> | null>} */
const deleteDialog = ref(null)

function showDeleteDialog(item) {
  deleteDialog.value?.show(item)
}

function showDeleteDialogForRouteQuery() {
  const itemId = parseInt(route.query.showDelete)
  if (isNaN(itemId)) return

  const item = travelAuthorizations.value.find((item) => item.id === itemId)
  if (!item) return

  showDeleteDialog(item)
}

defineExpose({
  refresh,
})
</script>

<style scoped></style>
