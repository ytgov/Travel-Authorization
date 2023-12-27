<template>
  <v-data-table
    :headers="headers"
    :items="expenses"
    :items-per-page="10"
    :loading="isLoading"
    class="elevation-2"
  >
  </v-data-table>
</template>

<script setup>
import { onMounted, ref } from "vue"

import { TYPES, EXPENSE_TYPES } from "@/api/expenses-api"
import useExpenses from "@/use/expenses"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { expenses, isLoading, ensure } = useExpenses()

const headers = ref([
  { text: "Date", value: "date" },
  { text: "Description", value: "description" },
  { text: "Amount", value: "cost" },
])

onMounted(async () => {
  await ensure({
    where: {
      travelAuthorizationId: props.travelAuthorizationId,
      type: TYPES.EXPENSE,
      expenseType: EXPENSE_TYPES.MEALS_AND_INCIDENTALS,
    },
  })
})
</script>
