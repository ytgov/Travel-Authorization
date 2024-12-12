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
          <!-- TODO: make this a re-usable component -->
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
import { computed, toRefs } from "vue"
import { isNil, sumBy } from "lodash"

import formatCurrency from "@/utils/format-currency"
import useTravelAuthorization from "@/use/use-travel-authorization"
import useTravelAuthorizationPreApprovalProfile from "@/use/use-travel-authorization-pre-approval-profile"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization, estimates } = useTravelAuthorization(travelAuthorizationId)

const estimatedCost = computed(() => sumBy(estimates.value, "cost"))

const travelAuthorizationPreApprovalProfileId = computed(() => {
  return travelAuthorization.value?.preApprovalProfileId
})
const {
  travelAuthorizationPreApprovalProfile,
  isLoading: isLoadingTravelAuthorizationPreApprovalProfile,
} = useTravelAuthorizationPreApprovalProfile(travelAuthorizationPreApprovalProfileId)

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
</script>
