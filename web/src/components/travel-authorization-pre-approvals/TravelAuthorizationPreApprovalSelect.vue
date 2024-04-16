<template>
  <v-select
    :value="value"
    :items="travelAuthorizationPreApprovals"
    :loading="isLoading"
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

import travelAuthorizationPreApprovalsApi from "@/api/travel-authorization-pre-approvals-api"

const props = defineProps({
  value: {
    type: Number,
    default: null,
  },
  department: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(["input"])

const travelAuthorizationPreApprovals = ref([])
const isLoading = ref(false)

watch(
  () => props.department,
  async (newDepartment) => {
    await fetch(newDepartment)
  },
  { immediate: true }
)

/**
 *
 * @param {string | null} department
 */
async function fetch(department) {
  // Since we can't determine if a pre-approval applies, the user doesn't get any options.
  if (isEmpty(department)) {
    travelAuthorizationPreApprovals.value = []
    return
  }

  isLoading.value = true
  try {
    const { travelAuthorizationPreApprovals: newTravelAuthorizationPreApprovals } =
      await travelAuthorizationPreApprovalsApi.list({ where: { department } })
    const flatRequests = flattenRequests(newTravelAuthorizationPreApprovals)
    const options = flatRequests.map((request) => {
      const { fullName, purpose, month } = request
      const text = !isEmpty(fullName) ? fullName : [purpose, month].filter(Boolean).join(" - ")
      return {
        text,
        value: request.id,
      }
    })
    travelAuthorizationPreApprovals.value = options
  } finally {
    isLoading.value = false
  }
}

function flattenRequests(travelAuthorizationPreApprovals) {
  return travelAuthorizationPreApprovals.flatMap(({ travelers, ...otherRequestAttributes }) => {
    const { department, branch } = otherRequestAttributes
    // If there are no travelers, generate a generic "staff" record
    if (travelers.length === 0) {
      return {
        ...otherRequestAttributes,
        travelerID: null,
        fullName: [department, branch, "staff"].filter(Boolean).join(" "),
      }
    }

    // Otherwise, return an array of requests, one for each traveler
    return travelers.map((traveler) => ({
      ...otherRequestAttributes,
      travelerID: traveler.travelerID,
      fullName: traveler.fullName,
    }))
  })
}
</script>
