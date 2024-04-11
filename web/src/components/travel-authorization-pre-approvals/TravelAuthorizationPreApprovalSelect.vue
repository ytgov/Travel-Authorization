<template>
  <v-select
    :value="value"
    :items="travelAuthorizationPreApprovals"
    :loading="isLoadingPreApprovedTravelRequests"
    label="Pre-approved Travel Request?"
    no-data-text="No pre-approvals available"
    v-bind="$attrs"
    @input="emit('input', $event)"
    v-on="$listeners"
  ></v-select>
</template>

<script setup>
import { ref, watch } from "vue"
import { isEmpty } from "lodash"

import preApprovedTravelRequestsApi from "@/api/pre-approved-travel-requests-api"

const props = defineProps({
  value: {
    type: String,
    default: null,
  },
  department: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(["input"])

const travelAuthorizationPreApprovals = ref([])
const isLoadingPreApprovedTravelRequests = ref(false)

watch(
  () => props.department,
  async (newDepartment) => {
    await loadPreApprovedTravelRequests(newDepartment)
  },
  { immediate: true }
)

/**
 *
 * @param {string | null} department
 */
async function loadPreApprovedTravelRequests(department) {
  // Since we can't determine if a pre-approval applies, the user doesn't get any options.
  if (isEmpty(department)) {
    travelAuthorizationPreApprovals.value = []
    return
  }

  isLoadingPreApprovedTravelRequests.value = true
  try {
    const { preApprovedTravelRequests: newTravelAuthorizationPreApprovals } =
      await preApprovedTravelRequestsApi.list({ where: { department } })
    const flatRequests = flattenRequests(newTravelAuthorizationPreApprovals)
    const options = flatRequests.map((request) => {
      const text = isEmpty(request.fullName)
        ? `${request.purpose} - ${request.month}`
        : `${request.purpose} - ${request.month} - ${request.fullName}`
      return {
        text,
        value: request.id,
      }
    })
    travelAuthorizationPreApprovals.value = options
  } finally {
    isLoadingPreApprovedTravelRequests.value = false
  }
}

function flattenRequests(travelAuthorizationPreApprovals) {
  return travelAuthorizationPreApprovals.flatMap(
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
