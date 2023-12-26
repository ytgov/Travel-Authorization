<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="10"
    :loading="isLoading"
    class="elevation-2"
  >
  </v-data-table>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"

import { TYPES, EXPENSE_TYPES } from "@/api/expenses-api"
import store from "@/store"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const items = computed(() => store.getters["expenses/items"])
const isLoading = computed(() => store.getters["expenses/isLoading"])
const headers = ref([
  { text: "Date", value: "date" },
  { text: "Description", value: "description" },
  { text: "Amount", value: "cost" },
])

onMounted(async () => {
  await store.dispatch("expenses/ensure", {
    where: {
      travelAuthorizationId: props.travelAuthorizationId,
      type: TYPES.EXPENSE,
      expenseType: EXPENSE_TYPES.MEALS_AND_INCIDENTALS,
    },
  })
})
</script>
