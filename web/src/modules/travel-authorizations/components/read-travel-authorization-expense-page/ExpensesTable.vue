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
    <template #item.actions="{ item }">
      <ViewRecieptLink
        v-if="item.fileSize"
        :expense-id="item.id"
      />
      <span
        v-else
        class="text-error"
        >Receipt is missing</span
      >
    </template>
    <template #foot>
      <tfoot>
        <tr>
          <td
            :class="totalRowClasses"
            colspan="2"
          ></td>
          <td :class="totalRowClasses">Total</td>
          <td :class="totalRowClasses">{{ formatCurrency(totalAmount) }}</td>
          <td
            :class="totalRowClasses"
            colspan="1"
          ></td>
        </tr>
      </tfoot>
    </template>
  </v-data-table>
</template>

<script setup>
import { sumBy } from "lodash"
import { DateTime } from "luxon"
import { computed, ref, watch } from "vue"

import useExpenses from "@/use/expenses"

import ViewRecieptLink from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ViewRecieptLink.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const headers = ref([
  { text: "Expense Type", value: "expenseType" },
  { text: "Description", value: "description" },
  { text: "Date", value: "date" },
  { text: "Amount", value: "cost" },
  { text: "", value: "actions" },
])
const totalRowClasses = ref("text-start font-weight-bold text-uppercase")

const { expenses, isLoading, fetch, TYPES, EXPENSE_TYPES } = useExpenses()

const totalAmount = computed(() => sumBy(expenses.value, "cost"))

watch(
  () => props.travelAuthorizationId,
  async (newTravelAuthorizationId) => {
    await fetch({
      where: {
        travelAuthorizationId: newTravelAuthorizationId,
        type: TYPES.EXPENSE,
        expenseType: [EXPENSE_TYPES.ACCOMMODATIONS, EXPENSE_TYPES.TRANSPORTATION],
      },
    })
  },
  { immediate: true }
)

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
