<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="table-heading@3"
  />
  <v-container
    v-else
    class="elevation-2"
  >
    <v-row>
      <v-col
        cols="6"
        class="text-right"
        >Subtotal Claim:</v-col
      >
      <v-col cols="6">{{ formatCurrency(subTotalClaim) }}</v-col>
    </v-row>
    <v-row>
      <v-col
        cols="6"
        class="text-right"
        >Travel Advance:</v-col
      >
      <v-col cols="6">{{ formatCurrency(travelAdvance) }}</v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="6"></v-col>
      <v-col cols="6">
        <div class="border-solid border-t border-black w-16"></div>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col
        cols="6"
        class="text-right"
      >
        <strong>Total Claim:</strong>
      </v-col>
      <v-col cols="6">
        <strong>
          {{ formatCurrency(totalClaim) }}
        </strong>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { sumBy } from "lodash"
import { computed, watch } from "vue"

import useExpenses, { TYPES } from "@/use/expenses"
import useTravelAuthorization from "@/use/travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const expenseOptions = computed(() => ({
  where: {
    travelAuthorizationId: props.travelAuthorizationId,
    type: TYPES.EXPENSE,
  },
}))
const { expenses, isLoading: isLoadingExpenses } = useExpenses(expenseOptions)
const {
  travelAuthorization,
  isLoading: isLoadingTravelAuthorization,
  fetch: fetchTravelAuthorization,
} = useTravelAuthorization(props.travelAuthorizationId)

const isLoading = computed(() => isLoadingExpenses.value || isLoadingTravelAuthorization.value)
// Will need to be calculated in the back-end if data is multi-page.
const subTotalClaim = computed(() => sumBy(expenses.value, "cost"))
const travelAdvance = computed(() => travelAuthorization.value.travelAdvanceInCents / 100.0)
const totalClaim = computed(() => subTotalClaim.value - travelAdvance.value)

watch(
  () => props.travelAuthorizationId,
  async () => {
    await Promise.all([await fetchTravelAuthorization()])
  },
  { immediate: true }
)

function formatCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  })
  return formatter.format(amount)
}
</script>

<style scoped>
/* See https://tailwindcss.com/docs/border-width */
.border-solid {
  border-style: solid;
}
.border-t {
  border-width: 0px;
  border-top-width: 1px;
}

.border-black {
  border-color: rgb(0 0 0);
}

.w-16 {
  width: 4rem; /* 64px */
}
</style>
