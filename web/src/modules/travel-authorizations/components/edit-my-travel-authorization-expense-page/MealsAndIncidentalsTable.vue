<template>
  <v-data-table
    :headers="headers"
    :items="expenses"
    :items-per-page="10"
    :loading="isLoading"
    class="elevation-2"
  >
    <template #item.date="{ value }">
      {{ formatDate(value) }}
    </template>
    <template #item.cost="{ value }">
      {{ formatCurrency(value) }}
    </template>
    <template #foot>
      <tfoot>
        <tr>
          <td :class="totalRowClasses"></td>
          <td :class="totalRowClasses">Total</td>
          <td :class="totalRowClasses">{{ formatCurrency(totalAmount) }}</td>
        </tr>
      </tfoot>
    </template>
  </v-data-table>
</template>

<script setup>
import { sumBy } from "lodash"
import { computed, onMounted, ref } from "vue"
import { DateTime } from "luxon"

import { TYPES, EXPENSE_TYPES } from "@/api/expenses-api"
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

const headers = ref([
  { text: "Date", value: "date" },
  { text: "Description", value: "description" },
  { text: "Amount", value: "cost" },
])

const totalRowClasses = ref("text-start font-weight-bold text-uppercase")

// Will need to be calculated in the back-end if data is multi-page.
const totalAmount = computed(() => sumBy(expenses.value, "cost"))

onMounted(async () => {
  await refresh()
})

async function refresh() {
  await fetch({
    where: {
      travelAuthorizationId: props.travelAuthorizationId,
      type: TYPES.EXPENSE,
      expenseType: EXPENSE_TYPES.MEALS_AND_INCIDENTALS,
    },
  })
}

function formatDate(date) {
  return DateTime.fromISO(date, { zone: "utc" }).toFormat("d-LLLL-yyyy")
}

function formatCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  })
  return formatter.format(amount)
}
</script>
