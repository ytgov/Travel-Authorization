<template>
  <v-dialog
    v-model="showDialog"
    max-width="500px"
  >
    <v-card>
      <!-- TODO: add estimate description? to this dialog -->
      <v-card-title class="text-h5">
        Are you sure you want to delete the following estimate?
        <v-container
          class="text-body-1"
          v-if="hasEstimate"
        >
          <v-row no-gutters>
            <v-col class="text-center">
              {{ estimate.expenseType }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="text-center">
              {{ estimate.description }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="text-center">
              {{ formatDate(estimate.date) }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="text-center">
              {{ formatCurrency(estimate.cost) }}
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          :loading="loading"
          @click="close"
          >Cancel</v-btn
        >
        <v-btn
          color="error"
          :loading="loading"
          @click="deleteAndClose"
          >OK</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { isEmpty } from "lodash"

import expensesApi from "@/apis/expenses-api"

export default {
  name: "EstimateDeleteDialog",
  data: () => ({
    estimate: {},
    showDialog: false,
    loading: false,
  }),
  computed: {
    estimateId() {
      return this.estimate.id
    },
    hasEstimate() {
      return !isEmpty(this.estimate)
    },
  },
  watch: {
    showDialog(value) {
      if (value) {
        if (this.$route.query.showDelete === this.estimate.id.toString()) return

        this.$router.push({ query: { showDelete: this.estimate.id } })
      } else {
        this.$router.push({ query: { showDelete: undefined } })
      }
    },
  },
  methods: {
    show(estimate) {
      this.estimate = estimate
      this.showDialog = true
    },
    close() {
      this.showDialog = false
    },
    deleteAndClose() {
      this.loading = true
      return expensesApi
        .delete(this.estimateId)
        .then(() => {
          this.$emit("deleted")
          this.close()
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
        .finally(() => {
          this.loading = false
        })
    },
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
