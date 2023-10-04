<template>
  <div class="mt-4">
    <div class="d-flex justify-end">
      <v-btn color="primary">Add Estimate</v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="estimates"
      :items-per-page="5"
      class="elevation-2"
    >
      <template #item.date="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #item.amount="{ value }">
        {{ formatCurrency(value) }}
      </template>
      <template #item.action="{ value }">
        <v-btn
          v-if="value === 'edit'"
          color="secondary"
          >Edit</v-btn
        >
      </template>
      <template #foot>
        <tfoot>
          <tr>
            <td :class="totalRowClasses"></td>
            <td :class="totalRowClasses"></td>
            <td :class="totalRowClasses">Total</td>
            <td :class="totalRowClasses">{{ formatCurrency(totalAmount) }}</td>
            <td :class="totalRowClasses"></td>
          </tr>
        </tfoot>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { sumBy } from "lodash"

import expensesApi from "@/apis/expenses-api"

// Must match types in src/api/models/expense.ts
const EXPENSE_TYPES = Object.freeze({
  ESTIMATE: "Estimates",
})

export default {
  name: "EstimateTab",
  components: {},
  props: {
    formId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    headers: [
      { text: "Expense Type", value: "expenseType" },
      { test: "Description", value: "description" },
      { text: "Date", value: "date" },
      { text: "Amount", value: "amount" },
      { text: "", value: "action" },
    ],
    estimates: [
      {
        expenseType: "Flights",
        description: "Departure - Whitehorse - Vancover",
        date: "2022-06-05T07:00:00.000Z",
        amount: 350.0,
        action: "edit",
      },
      {
        expenseType: "Accommodations",
        description: "Room cost",
        date: "2022-06-05T07:00:00.000Z",
        amount: 250.0,
        action: "edit",
      },
      {
        expenseType: "Meals & Incidentals",
        description: "Full Day",
        date: "2022-06-05T07:00:00.000Z",
        amount: 128.45,
        action: null,
      },
      {
        expenseType: "Accommodations",
        description: "Room cost",
        date: "2022-06-06T07:00:00.000Z",
        amount: 250.0,
        action: "edit",
      },
      {
        expenseType: "Meals & Incidentals",
        description: "Full Day",
        date: "2022-06-06T07:00:00.000Z",
        amount: 128.45,
        action: null,
      },
      {
        expenseType: "Flights",
        description: "Return - Vancover - Whitehorse",
        date: "2022-06-07T07:00:00.000Z",
        amount: 350.0,
        action: "edit",
      },
      {
        expenseType: "Meals & Incidentals",
        description: "Breakfast/Lunch",
        date: "2022-06-07T07:00:00.000Z",
        amount: 46.7,
        action: null,
      },
    ],
    totalRowClasses: "text-start font-weight-bold text-uppercase",
  }),
  computed: {
    // Will need to be calculated in the back-end if data is multi-page.
    totalAmount() {
      return sumBy(this.estimates, "amount")
    },
  },
  async mounted() {
    await expensesApi
      .list({ where: { taid: this.formId, type: EXPENSE_TYPES.ESTIMATE } })
      .then(({ expenses: estimates }) => {
        console.log("estimates:", estimates)
        // TODO: enable this once endpoint is returning data.
        // this.estimates = estimates
      })
  },
  methods: {
    formatDate(date) {
      const parsedDate = new Date(date)
      const formatter = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      return formatter.format(parsedDate).replace(/ /g, "-")
    },
    formatCurrency(amount) {
      const formatter = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      })
      return formatter.format(amount)
    },
  },
}
</script>
