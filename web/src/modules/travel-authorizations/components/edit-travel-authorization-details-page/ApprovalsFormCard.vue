<template>
  <v-card>
    <v-card-title> Approvals </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-row>
          <v-col
            cols="12"
            md="2"
          >
            <EstimatedCostTextField :estimates="estimates" />
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-btn
              v-if="hasEstimates"
              :to="{
                name: 'EditTravelAuthorizationEstimatePage',
                params: { travelAuthorizationId: travelAuthorizationId },
              }"
              class="mt-1"
              color="secondary"
              >Edit Estimate</v-btn
            >
            <EstimateGenerateDialog
              v-else
              :travel-authorization-id="travelAuthorizationId"
              button-classes="mt-1"
              button-color="primary"
              @created="refreshEstimates"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="2"
          >
            <v-text-field
              v-model="travelAdvanceInDollars"
              :rules="[required, isInteger]"
              label="Travel Advance"
              prefix="$"
              dense
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-select
              v-model="travelAuthorization.preappId"
              :items="preApprovedTravelRequests"
              :loading="isLoadingUser || isLoadingPreApprovedTravelRequests"
              label="Pre-approved Travel Request?"
              no-data-text="No pre-approvals available"
              dense
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="3"
          >
            <SearchableUserEmailCombobox
              v-model="travelAuthorization.supervisorEmail"
              :rules="[required]"
              label="Submit to"
              dense
              outlined
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <SubmitToSupervisorButton
              :travel-authorization-id="travelAuthorizationId"
              :validate="validate"
              :estimates="estimates"
              class="mt-1"
            />
          </v-col>
        </v-row>
      </v-form>

      <v-row>
        <v-col>
          <TravelAuthorizationActionLogsTable :travel-authorization-id="travelAuthorizationId" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { isEmpty } from "lodash"

import { required, isInteger } from "@/utils/validators"
import preApprovedTravelRequestsApi from "@/api/pre-approved-travel-requests-api"
import useExpenses, { TYPES as EXPENSE_TYPES } from "@/use/use-expenses"
import useUser from "@/use/use-user"

import SearchableUserEmailCombobox from "@/components/SearchableUserEmailCombobox"
import EstimatedCostTextField from "@/modules/travel-authorizations/components/EstimatedCostTextField"
import TravelAuthorizationActionLogsTable from "@/modules/travel-authorizations/components/TravelAuthorizationActionLogsTable"

import EstimateGenerateDialog from "@/modules/travel-authorizations/components/edit-travel-authorization-details-page/approvals-form-card/EstimateGenerateDialog"
import SubmitToSupervisorButton from "@/modules/travel-authorizations/components/edit-travel-authorization-details-page/approvals-form-card/SubmitToSupervisorButton"
import useTravelAuthorization from "@/use/use-travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
  validate: {
    type: Function,
    required: true,
  },
})

const { travelAuthorization } = useTravelAuthorization(props.travelAuthorizationId)
const expenseOptions = computed(() => ({
  where: {
    travelAuthorizationId: props.travelAuthorizationId,
    type: EXPENSE_TYPES.ESTIMATE,
  },
}))
const { expenses: estimates, fetch: refreshEstimates } = useExpenses(expenseOptions)
const userId = computed(() => travelAuthorization.value.userId)
const { user, isLoading: isLoadingUser } = useUser(userId)

const preApprovedTravelRequests = ref([])
const isLoadingPreApprovedTravelRequests = ref(false)

const travelAdvanceInDollars = computed({
  get() {
    return Math.ceil(travelAuthorization.value.travelAdvanceInCents / 100.0) || 0
  },
  set(value) {
    travelAuthorization.value.travelAdvanceInCents = Math.ceil(value * 100)
  },
})
const hasEstimates = computed(() => estimates.value.length > 0)

onMounted(async () => {
  const department = user.department
  await loadPreApprovedTravelRequests(department)
})

async function loadPreApprovedTravelRequests(department) {
  // Since we can't determine if a pre-approval applies, the user doesn't get any options.
  if (isEmpty(department)) {
    preApprovedTravelRequests.value = []
    return
  }

  isLoadingPreApprovedTravelRequests.value = true
  try {
    const { preApprovedTravelRequests } = await preApprovedTravelRequestsApi.list({
      where: { department },
    })
    const flatRequests = flattenRequests(preApprovedTravelRequests)
    const options = flatRequests.map((request) => {
      const text = isEmpty(request.fullName)
        ? `${request.purpose} - ${request.month}`
        : `${request.purpose} - ${request.month} - ${request.fullName}`
      return {
        text,
        value: request.id,
      }
    })
    preApprovedTravelRequests.value = options
  } finally {
    isLoadingPreApprovedTravelRequests.value = false
  }
}

function flattenRequests(preApprovedTravelRequests) {
  return preApprovedTravelRequests.flatMap(
    ({ preApprovedTravelers, ...otherRequestAttributes }) => {
      // If there are no travelers, return the request as is
      if (preApprovedTravelers.length === 0) {
        return {
          ...otherRequestAttributes,
          travelerID: null,
          fullName: null,
        }
      }

      // Otherwise, return an array of requests, one for each traveler
      return preApprovedTravelers.map((traveler) => ({
        ...otherRequestAttributes,
        travelerID: traveler.travelerID,
        fullName: traveler.fullName,
      }))
    }
  )
}
</script>
