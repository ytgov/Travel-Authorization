<template>
  <v-data-table
    :headers="headers"
    :items="estimates"
    :items-per-page="10"
    :loading="loading"
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
    estimates: [],
    totalRowClasses: "text-start font-weight-bold text-uppercase",
    loading: true,
  }),
  computed: {
    // Will need to be calculated in the back-end if data is multi-page.
    totalAmount() {
      return sumBy(this.estimates, "cost")
    },
  },
  mounted() {
    return this.loadEstimates()
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
    loadEstimates() {
      this.loading = true
      return expensesApi
        .list({ where: { taid: this.formId, type: TYPES.ESTIMATE } })
        .then(({ expenses: estimates }) => {
          this.estimates = estimates
        })
        .finally(() => {
          this.loading = false
        })
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
