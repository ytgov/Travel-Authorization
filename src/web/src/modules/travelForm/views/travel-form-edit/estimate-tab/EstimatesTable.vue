<template>
  <v-data-table
    :headers="headers"
    :items="estimates"
    :items-per-page="10"
    :loading="loadingEstimates"
    class="elevation-2"
  >
    <template v-slot:top>
      <EstimateEditDialog
        ref="editDialog"
        @saved="refresh"
      />
      <EstimateDeleteDialog
        ref="deleteDialog"
        @deleted="refresh"
      />
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
import { mapActions, mapState } from "vuex"
import { DateTime } from "luxon"

import EstimateDeleteDialog from "./EstimateDeleteDialog"
import EstimateEditDialog from "./EstimateEditDialog"

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
    totalRowClasses: "text-start font-weight-bold text-uppercase",
  }),
  computed: {
    ...mapState("travelForm", ["estimates", "loadingEstimates"]),
    // Will need to be calculated in the back-end if data is multi-page.
    totalAmount() {
      return sumBy(this.estimates, "cost")
    },
  },
  mounted() {
    return this.loadEstimates({ formId: this.formId }).then(() => {
      this.showEditDialogForRouteQuery()
      this.showDeleteDialogForRouteQuery()
    })
  },
  methods: {
    ...mapActions("travelForm", ["loadEstimates"]),
    formatDate(date) {
      return DateTime.fromISO(date, { zone: "utc" }).toFormat("d-LLLL-yyyy")
    },
    formatCurrency(amount) {
      const formatter = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      })
      return formatter.format(amount)
    },
    refresh() {
      return this.loadEstimates({ formId: this.formId })
    },
    showDeleteDialog(item) {
      this.$refs.deleteDialog.show(item)
    },
    showEditDialog(item) {
      this.$refs.editDialog.show(item)
    },
    showEditDialogForRouteQuery() {
      const estimateId = parseInt(this.$route.query.showEdit)
      if (isNaN(estimateId)) return

      const estimate = this.estimates.find((estimate) => estimate.id === estimateId)
      if (!estimate) return

      this.showEditDialog(estimate)
    },
    showDeleteDialogForRouteQuery() {
      const estimateId = parseInt(this.$route.query.showDelete)
      if (isNaN(estimateId)) return

      const estimate = this.estimates.find((estimate) => estimate.id === estimateId)
      if (!estimate) return

      this.showDeleteDialog(estimate)
    },
  },
}
</script>
