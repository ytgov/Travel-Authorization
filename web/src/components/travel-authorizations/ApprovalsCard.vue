<template>
  <v-card>
    <v-card-title> Approvals </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          md="3"
        >
          <!-- TODO: add tooltip with link to estimate tab explaining where this data comes from -->
          <v-text-field
            :value="formatCurrency(estimatedCost)"
            label="Estimated Cost"
            disabled
            dense
            outlined
            readonly
            append-icon="mdi-lock"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            :value="travelAdvanceInDollars"
            label="Travel Advance"
            prefix="$"
            dense
            outlined
            readonly
            append-icon="mdi-lock"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            :value="travelAuthorizationPreApprovalProfileText"
            :loading="isLoadingTravelAuthorizationPreApprovalProfile"
            label="Pre-approved travel for (if applicable)"
            dense
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            :value="travelAuthorization.supervisorEmail"
            label="Submit to"
            dense
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref, toRefs, watch } from "vue"
import { isNil, sumBy } from "lodash"

import formatCurrency from "@/utils/format-currency"
import useTravelAuthorization from "@/use/use-travel-authorization"

import travelAuthorizationPreApprovalProfilesApi from "@/api/travel-authorization-pre-approval-profiles-api"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization, estimates } = useTravelAuthorization(travelAuthorizationId)

const travelAuthorizationPreApprovalProfile = ref(null)
const isLoadingTravelAuthorizationPreApprovalProfile = ref(false)

const estimatedCost = computed(() => sumBy(estimates.value, "cost"))

const travelAuthorizationPreApprovalProfileText = computed(() => {
  if (
    isNil(travelAuthorizationPreApprovalProfile.value) ||
    isLoadingTravelAuthorizationPreApprovalProfile.value
  ) {
    return ""
  }

  return travelAuthorizationPreApprovalProfile.value.profileName
})

const travelAdvanceInDollars = computed(() =>
  Math.ceil(travelAuthorization.value.travelAdvanceInCents / 100.0)
)

// TODO: move to a use file
watch(
  () => travelAuthorization.value,
  async (newTravelAuthorization) => {
    if (isNil(newTravelAuthorization)) {
      return
    }

    const { preApprovalProfileId } = newTravelAuthorization
    if (isNil(preApprovalProfileId)) {
      return
    }

    await loadTravelAuthorizationPreApprovedProfile(preApprovalProfileId)
  }
)

async function loadTravelAuthorizationPreApprovedProfile(preApprovalProfileId) {
  isLoadingTravelAuthorizationPreApprovalProfile.value = true
  try {
    const { travelAuthorizationPreApprovalProfile: newProfile } =
      await travelAuthorizationPreApprovalProfilesApi.get(preApprovalProfileId)
    travelAuthorizationPreApprovalProfile.value = newProfile
  } finally {
    isLoadingTravelAuthorizationPreApprovalProfile.value = false
  }
}
</script>
