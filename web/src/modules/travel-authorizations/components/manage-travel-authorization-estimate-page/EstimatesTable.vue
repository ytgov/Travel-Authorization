<template>
  <v-data-table
    :headers="headers"
    :items="estimates"
    :items-per-page="10"
    :loading="loadingEstimates"
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

export default {
  name: "EstimatesTable",
  components: {},
  props: {
    travelAuthorizationId: {
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
      // { text: "", value: "actions" }, // no actions; read-only
    ],
    totalRowClasses: "text-start font-weight-bold text-uppercase",
  }),
  computed: {
    ...mapState("travelAuthorizations", ["estimates", "loadingEstimates"]),
    // Will need to be calculated in the back-end if data is multi-page.
    totalAmount() {
      return sumBy(this.estimates, "cost")
    },
  },
  mounted() {
    return this.loadEstimates({ travelAuthorizationId: this.travelAuthorizationId })
  },
  methods: {
    ...mapActions("travelAuthorizations", ["loadEstimates"]),
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
  },
}
</script>
