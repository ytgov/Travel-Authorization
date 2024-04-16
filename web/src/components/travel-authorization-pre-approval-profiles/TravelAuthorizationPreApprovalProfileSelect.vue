<template>
  <v-select
    :value="value"
    :items="profiles"
    :loading="isLoading"
    label="Pre-approved travel for (if applicable)"
    no-data-text="No pre-approvals available"
    v-bind="$attrs"
    @input="emit('input', $event)"
    v-on="$listeners"
  ></v-select>
</template>

<script setup>
import { ref, watch } from "vue"
import { isEmpty } from "lodash"

import travelAuthorizationPreApprovalProfilesApi from "@/api/travel-authorization-pre-approval-profiles-api"

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

const profiles = ref([])
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
    profiles.value = []
    return
  }

  isLoading.value = true
  try {
    const { travelAuthorizationPreApprovalProfiles: newProfiles } =
      await travelAuthorizationPreApprovalProfilesApi.list({
        where: { department },
        filters: {
          approved: true,
          openDateOrBeforeStartDate: true,
        },
      })
    profiles.value = newProfiles.map(({ id, profileName }) => {
      return {
        text: profileName,
        value: id,
      }
    })
  } finally {
    isLoading.value = false
  }
}
</script>
