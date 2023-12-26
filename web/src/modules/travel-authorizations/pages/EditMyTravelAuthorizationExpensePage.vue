<template>
  <div class="mt-4">
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-end">
          <h3>Traveler Expenses</h3>

          <ExpenseCreateDialog
            v-if="hasExpenses"
            :form-id="travelAuthorizationId"
            @created="refreshExpenses"
          />
          <ExpensePrefillDialog
            v-else
            :travel-authorization-id="travelAuthorizationId"
            @created="refreshExpenses"
          />
        </div>

        <ExpensesTable
          ref="expensesTable"
          :travel-authorization-id="travelAuthorizationId"
        />
        * Meals and Incidentals will be calculated by the system; do not add these expenses.
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h3>Meals and Incidentals</h3>
        <MealsAndIncidentalsTable :travel-authorization-id="travelAuthorizationId" />
      </v-col>
      <v-col></v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import { TYPES, EXPENSE_TYPES } from "@/api/expenses-api"

import ExpenseCreateDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ExpenseCreateDialog"
import ExpensePrefillDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ExpensePrefillDialog"
import ExpensesTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ExpensesTable"
import MealsAndIncidentalsTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/MealsAndIncidentalsTable.vue"

export default {
  name: "EditMyTravelAuthorizationExpensePage",
  components: {
    ExpenseCreateDialog,
    ExpensePrefillDialog,
    ExpensesTable,
    MealsAndIncidentalsTable,
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({}),
  computed: {
    ...mapGetters("expenses", ["items", "isLoading"]),
    hasExpenses() {
      return this.isLoading === false && this.items.length > 0
    },
  },
  async mounted() {
    await this.ensure({
      where: {
        travelAuthorizationId: this.travelAuthorizationId,
        type: TYPES.EXPENSE,
        expenseType: [EXPENSE_TYPES.ACCOMMODATIONS, EXPENSE_TYPES.TRANSPORTATION],
      },
    })
  },
  methods: {
    ...mapActions("expenses", ["ensure"]),
    refreshExpenses() {
      this.$refs.expensesTable.refresh()
    },
  },
}
</script>
