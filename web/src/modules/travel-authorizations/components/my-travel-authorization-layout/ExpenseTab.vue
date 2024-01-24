<template>
  <v-tooltip
    v-if="isExpenseTabDisabled"
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
          Expense
          <v-icon
            class="ml-1"
            small
          >
            mdi-help-circle-outline
          </v-icon>
        </v-tab>
      </div>
    </template>
    <span>
      Expenses are locked until request is approved, and travel start date has passed. Locked
      reason(s):
      <ul>
        <li v-if="isInPreExpensingStates">not approved</li>
        <li v-if="isBeforeTravelStartDate">start date has not passed</li>
      </ul>
    </span>
  </v-tooltip>
  <v-tab
    v-else
    :to="{ name: componentName, params: { travelAuthorizationId } }"
  >
    Expense
  </v-tab>
</template>

<script setup>
import { isNil } from "lodash"
import { computed, onMounted } from "vue"

import useTravelAuthorization from "@/use/travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorization, fetch, isLoading, STATUSES } = useTravelAuthorization(
  props.travelAuthorizationId
)
const isInPreExpensingStates = computed(
  () =>
    travelAuthorization.value.status === STATUSES.DRAFT ||
    travelAuthorization.value.status === STATUSES.SUBMITTED
)
const isBeforeTravelStartDate = computed(() => {
  const firstTravelSegment = travelAuthorization.value.travelSegments[0]
  if (isNil(firstTravelSegment)) return false

  return new Date(firstTravelSegment.departureOn) > new Date()
})
const isAfterTravelStartDate = computed(() => !isBeforeTravelStartDate.value)
const isExpenseTabDisabled = computed(
  () => isInPreExpensingStates.value || isBeforeTravelStartDate.value
)
const isEditable = computed(
  () => travelAuthorization.value.status === STATUSES.APPROVED && isAfterTravelStartDate.value
)
const componentName = computed(() => {
  if (isEditable.value) {
    return "EditMyTravelAuthorizationExpensePage"
  }

  return "ReadMyTravelAuthorizationExpensePage"
})

onMounted(async () => {
  if (!isLoading.value) {
    await fetch()
  }
})
</script>
