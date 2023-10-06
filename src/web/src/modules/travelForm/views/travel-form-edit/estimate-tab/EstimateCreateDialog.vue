<template>
  <v-dialog
    v-model="showDialog"
    max-width="500px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        class="mb-2"
        v-bind="attrs"
        v-on="on"
      >
        Add Estimate
      </v-btn>
    </template>
    <v-form
      ref="form"
      @submit.prevent="createAndClose"
    >
      <v-card :loading="loading">
        <v-card-title>
          <span class="text-h5">Create Estimate</span>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <ExpenseTypeSelect
                v-model="estimate.expenseType"
                :rules="[required]"
                label="Expense Type"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="estimate.description"
                :rules="[required]"
                label="Description"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <DatePicker
                v-model="estimate.date"
                :rules="[required]"
                label="Date"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <CurrencyTextField
                v-model="estimate.cost"
                :rules="[required]"
                label="Amount"
                required
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="loading"
            color="error"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            :loading="loading"
            color="primary"
            type="submit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { required } from "@/utils/validators"

import CurrencyTextField from "@/components/Utils/CurrencyTextField"
import DatePicker from "@/components/Utils/DatePicker"
import ExpenseTypeSelect from "@/modules/travelForm/components/ExpenseTypeSelect"

import expensesApi from "@/apis/expenses-api"

// Must match types in src/api/models/expense.ts
const EXPENSE_TYPES = Object.freeze({
  ESTIMATE: "Estimates",
})

export default {
  name: "EstimateCreateDialog",
  components: {
    CurrencyTextField,
    DatePicker,
    ExpenseTypeSelect,
  },
  props: {
    formId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      estimate: this.newEstimate(),
      showDialog: this.$route.query.showCreate === "true",
      loading: false,
    }
  },
  watch: {
    showDialog(value) {
      if (value) {
        this.$router.push({ query: { showCreate: value } })
      } else {
        this.$router.push({ query: { showCreate: undefined } })
      }
    },
  },
  methods: {
    required,
    newEstimate() {
      return {
        taid: this.formId,
        type: EXPENSE_TYPES.ESTIMATE,
        currency: "CAD",
      }
    },
    close() {
      this.showDialog = false
      this.$nextTick(() => {
        this.estimate = this.newEstimate()
        this.$refs.form.resetValidation()
      })
    },
    createAndClose() {
      this.loading = true
      return expensesApi
        .create(this.estimate)
        .then(() => {
          this.$emit("created")
          this.close()
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
