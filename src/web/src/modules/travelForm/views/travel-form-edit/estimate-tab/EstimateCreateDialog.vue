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
    <v-card>
      <v-card-title>
        <span class="text-h5">Create Estimate</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <ExpenseTypeSelect
            v-model="estimate.expenseType"
            :rules="[required]"
            label="Expense Type"
            required
          />
          <v-text-field
            v-model="estimate.description"
            :rules="[required]"
            label="Description"
            required
          ></v-text-field>
          <DatePicker
            v-model="estimate.date"
            :rules="[required]"
            label="Date"
            required
          />
          <v-text-field
            v-model="estimate.cost"
            label="Amount"
          ></v-text-field>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { required } from "@/utils/validators"

import DatePicker from "@/components/Utils/DatePicker"
import ExpenseTypeSelect from "@/modules/travelForm/components/ExpenseTypeSelect"

// Must match types in src/api/models/expense.ts
const EXPENSE_TYPES = Object.freeze({
  ESTIMATE: "Estimates",
})

export default {
  name: "EstimateCreateDialog",
  components: {
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
      estimate: {
        taid: this.formId,
        type: EXPENSE_TYPES.ESTIMATE,
      },
      showDialog: false,
    }
  },
  methods: {
    required,
    close() {
      this.showDialog = false
      this.$nextTick(() => {
        this.estimate = {}
      })
    },
    save() {
      // TODO: save to back-end
      // use save event to trigger table reload
      this.$emit("save", this.estimate)
      this.close()
    },
  },
}
</script>
