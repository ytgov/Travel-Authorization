<template>
  <v-data-table
    :headers="headers"
    :items="estimates"
    :items-per-page="5"
    class="elevation-2"
  >
    <template v-slot:top>
      <!-- <v-toolbar flat>
          <v-toolbar-title>My CRUD</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialogDelete"
            max-width="500px"
          >
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn
                  color="blue darken-1"
                  text
                  @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar> -->
    </template>
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
</template>

<script>
import { sumBy } from "lodash"

import expensesApi from "@/apis/expenses-api"

// Must match types in src/api/models/expense.ts
const EXPENSE_TYPES = Object.freeze({
  ESTIMATE: "Estimates",
})

export default {
  name: "EstimatesTable",
  components: {},
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
