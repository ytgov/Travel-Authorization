<template>
  <v-data-table
    :headers="headers"
    :items="estimates"
    :items-per-page="10"
    class="elevation-2"
  >
    <template v-slot:top>
      <EstimateEditDialog ref="editDialog" />
      <EstimateDeleteDialog ref="deleteDialog" />
    </template>
    <template #item.date="{ value }">
      {{ formatDate(value) }}
    </template>
    <template #item.cost="{ value }">
      {{ formatCurrency(value) }}
    </template>
    <template #item.actions="{ value: actions, item }">
      <div class="d-flex justify-end">
        <v-btn
          v-if="actions.includes('edit')"
          color="secondary"
          @click="showEditDialog(item)"
          >Edit</v-btn
        >
        <v-btn
          v-if="actions.includes('delete')"
          class="ml-2"
          color="error"
          @click="showDeleteDialog(item)"
          >Delete</v-btn
        >
      </div>
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
</template>

<script>
import { sumBy } from "lodash"

import expensesApi from "@/apis/expenses-api"
import EstimateDeleteDialog from "./EstimateDeleteDialog"
import EstimateEditDialog from "./EstimateEditDialog"

// Must match types in src/api/models/expense.ts
const TYPES = Object.freeze({
  ESTIMATE: "Estimates",
})

// Must match types in src/api/models/expense.ts
const EXPENSE_TYPES = Object.freeze({
  ACCOMODATIONS: "Accomodations",
  FLIGHTS: "Flights",
  MEALS_INCIDENTALS: "Meals & Incidentals",
})

export default {
  name: "EstimatesTable",
  components: {
    EstimateDeleteDialog,
    EstimateEditDialog,
  },
  props: {
    formId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    headers: [
      { text: "Expense Type", value: "expenseType" },
      { test: "Description", value: "description" },
      { text: "Date", value: "date" },
      { text: "Amount", value: "cost" },
      { text: "", value: "actions" },
    ],
    estimates: [
      {
        id: -1,
        expenseType: "Flights",
        description: "Departure - Whitehorse - Vancover",
        date: "2022-06-05T07:00:00.000Z",
        cost: 350.0,
        actions: ["edit", "delete"],
      },
      {
        id: -2,
        expenseType: "Accommodations",
        description: "Room cost",
        date: "2022-06-05T07:00:00.000Z",
        cost: 250.0,
        actions: ["edit", "delete"],
      },
      {
        id: -3,
        expenseType: "Meals & Incidentals",
        description: "Full Day",
        date: "2022-06-05T07:00:00.000Z",
        cost: 128.45,
        actions: ["delete"],
      },
      {
        id: -4,
        expenseType: "Accommodations",
        description: "Room cost",
        date: "2022-06-06T07:00:00.000Z",
        cost: 250.0,
        actions: ["edit", "delete"],
      },
      {
        id: -5,
        expenseType: "Meals & Incidentals",
        description: "Full Day",
        date: "2022-06-06T07:00:00.000Z",
        cost: 128.45,
        actions: ["delete"],
      },
      {
        id: -6,
        expenseType: "Flights",
        description: "Return - Vancover - Whitehorse",
        date: "2022-06-07T07:00:00.000Z",
        cost: 350.0,
        actions: ["edit", "delete"],
      },
      {
        id: -7,
        expenseType: "Meals & Incidentals",
        description: "Breakfast/Lunch",
        date: "2022-06-07T07:00:00.000Z",
        cost: 46.7,
        actions: ["delete"],
      },
    ],
    totalRowClasses: "text-start font-weight-bold text-uppercase",
  }),
  computed: {
    // Will need to be calculated in the back-end if data is multi-page.
    totalAmount() {
      return sumBy(this.estimates, "cost")
    },
  },
  async mounted() {
    await expensesApi
      .list({ where: { taid: this.formId, type: TYPES.ESTIMATE } })
      .then(({ expenses: estimates }) => {
        estimates.forEach((estimate) => {
          if (estimate.expenseType === EXPENSE_TYPES.MEALS_INCIDENTALS) {
            estimate.actions = ["delete"]
          } else {
            estimate.actions = ["edit", "delete"]
          }
        })
        console.log("estimates:", estimates)
        // TODO: enable this once endpoint is returning data.
        // this.estimates = estimates
        // this is just for debugging purposes, real code is above
        this.estimates.splice(0, estimates.length, ...estimates)
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
    showDeleteDialog(item) {
      this.$refs.deleteDialog.show(item)
    },
    showEditDialog(item) {
      this.$refs.editDialog.show(item)
    },
  },
}
</script>
