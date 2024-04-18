<template>
  <v-tooltip
    v-if="isWaitingForApproval"
    bottom
  >
    <template #activator="{ on }">
      <div
        class="d-flex align-center"
        v-on="on"
      >
        <v-tab
          class="d-flex align-start"
          disabled
        >
          Request
          <v-icon
            class="ml-1"
            small
          >
            mdi-help-circle-outline
          </v-icon>
        </v-tab>
      </div>
    </template>
    <span> Locked until request is approved. </span>
  </v-tooltip>
  <v-tab
    v-else
    :to="{
      name: 'MyTravelRequestsRequestEditPage',
      params: { travelAuthorizationId },
    }"
  >
    Request
  </v-tab>
</template>

<script setup>
import { computed, toRefs } from "vue"

import useTravelAuthorization from "@/use/use-travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization, STATUSES } = useTravelAuthorization(travelAuthorizationId)
// TODO: lock on denied states.
const isWaitingForApproval = computed(
  () =>
    travelAuthorization.value.status === STATUSES.DRAFT ||
    travelAuthorization.value.status === STATUSES.SUBMITTED
)
</script>
