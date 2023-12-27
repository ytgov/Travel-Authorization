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
        <MealsAndIncidentalsTable
          ref="mealsAndIncidentalsTable"
          :travel-authorization-id="travelAuthorizationId"
        />
      </v-col>
      <v-col>
        <h3>Totals</h3>
        <TotalsTable
          ref="totalsTable"
          :travel-authorization-id="travelAuthorizationId"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-end">
          <h3>Coding</h3>
          <v-btn color="primary">Add Coding (TODO)</v-btn>
        </div>
        <GeneralLedgerCodingsTable :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { TYPES } from "@/api/expenses-api"
import { useExpenses } from "@/use/expenses"

import ExpenseCreateDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ExpenseCreateDialog"
import ExpensePrefillDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ExpensePrefillDialog"
import ExpensesTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ExpensesTable"
import GeneralLedgerCodingsTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/GeneralLedgerCodingsTable.vue"
import MealsAndIncidentalsTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/MealsAndIncidentalsTable.vue"
import TotalsTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/TotalsTable.vue"

export default {
  name: "EditMyTravelAuthorizationExpensePage",
  components: {
    ExpenseCreateDialog,
    ExpensePrefillDialog,
    ExpensesTable,
    GeneralLedgerCodingsTable,
    MealsAndIncidentalsTable,
    TotalsTable,
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  data() {
    const { expenses, isLoading, fetch } = useExpenses()

    return {
      expenses,
      isLoading,
      fetch,
    }
  },
  computed: {
    hasExpenses() {
      return this.isLoading === false && this.expenses.length > 0
    },
  },
  async mounted() {
    await this.refresh()
  },
  methods: {
    async refresh() {
      await this.fetch({
        where: {
          travelAuthorizationId: this.travelAuthorizationId,
          type: TYPES.EXPENSE,
        },
      })
    },
    async refreshExpenses() {
      await Promise.all([
        this.refresh(),
        this.$refs.expensesTable.refresh(),
        this.$refs.mealsAndIncidentalsTable.refresh(),
        this.$refs.totalsTable.refresh(),
      ])
    },
  },
}
</script>
