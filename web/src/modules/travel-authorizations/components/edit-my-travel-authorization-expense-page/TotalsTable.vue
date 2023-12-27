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
import { computed, onMounted, ref } from "vue"

import { TYPES } from "@/api/expenses-api"
import useExpenses from "@/use/expenses"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

defineExpose({
  refresh,
})

const { expenses, isLoading, fetch } = useExpenses()

// Will need to be calculated in the back-end if data is multi-page.
const subTotalClaim = computed(() => sumBy(expenses.value, "cost"))
const travelAdvance = ref(0) // TODO: load this from the travel authorization
const totalClaim = computed(() => subTotalClaim.value - travelAdvance.value)

onMounted(async () => {
  await refresh()
})

async function refresh() {
  await fetch({
    where: {
      travelAuthorizationId: props.travelAuthorizationId,
      type: TYPES.EXPENSE,
    },
  })
}

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
