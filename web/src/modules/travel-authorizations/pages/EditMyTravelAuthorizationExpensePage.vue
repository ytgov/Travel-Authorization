<template>
  <div class="mt-4">
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-end">
          <h3>Traveler Expenses</h3>

          <ExpenseCreateDialog
            v-if="hasExpenses"
            :form-id="travelAuthorizationId"
            @created="refreshExpenseCreationDependencies"
          />
          <ExpensePrefillDialog
            v-else
            :travel-authorization-id="travelAuthorizationId"
            @created="refreshExpenseCreationDependencies"
          />
        </div>

        <ExpensesTable
          ref="expensesTable"
          :travel-authorization-id="travelAuthorizationId"
          @changed="refreshExpenseChangedDependencies"
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

          <GeneralLedgerCodingCreateDialog
            :travel-authorization-id="travelAuthorizationId"
            @created="refreshCodingsCreatedDependencies"
          />
        </div>

        <GeneralLedgerCodingsTable
          ref="codingsTable"
          :travel-authorization-id="travelAuthorizationId"
          @changed="refreshCodingsChangedDependencies"
        />
      </v-col>
      <v-col cols="4"></v-col>
    </v-row>
    <v-row class="mt-12">
      <v-col>
        <RequestApprovalForm
          ref="requestApprovalForm"
          :travel-authorization-id="travelAuthorizationId"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TravelAuthorizationActionLogsTable :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { computed } from "vue"

import { useExpenses, TYPES } from "@/use/use-expenses"
import store from "@/store"

import ExpenseCreateDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ExpenseCreateDialog"
import ExpensePrefillDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ExpensePrefillDialog"
import ExpensesTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ExpensesTable"
import GeneralLedgerCodingCreateDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/GeneralLedgerCodingCreateDialog.vue"
import GeneralLedgerCodingsTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/GeneralLedgerCodingsTable.vue"
import MealsAndIncidentalsTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/MealsAndIncidentalsTable.vue"
import RequestApprovalForm from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/RequestApprovalForm.vue"
import TotalsTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/TotalsTable.vue"
import TravelAuthorizationActionLogsTable from "@/modules/travel-authorizations/components/TravelAuthorizationActionLogsTable"

export default {
  name: "EditMyTravelAuthorizationExpensePage",
  components: {
    ExpenseCreateDialog,
    ExpensePrefillDialog,
    ExpensesTable,
    GeneralLedgerCodingCreateDialog,
    GeneralLedgerCodingsTable,
    MealsAndIncidentalsTable,
    RequestApprovalForm,
    TotalsTable,
    TravelAuthorizationActionLogsTable,
  },
  // CONSIDER: Should I just put this in the mounted hook?
  // Alterntively, should control this situation by never showing the edit link to a user if they can't edit?
  async beforeRouteEnter(to, _from, next) {
    if (to.name !== "EditMyTravelAuthorizationExpensePage") {
      return next()
    }

    await store.dispatch("travelAuthorization/fetch", to.params.travelAuthorizationId)

    if (store.getters["travelAuthorization/isExpenseEditable"]) {
      return next()
    }

    next({
      name: "ReadMyTravelAuthorizationExpensePage",
      params: { travelAuthorizationId: to.params.travelAuthorizationId },
    })
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  data() {
    const expenseOptions = computed(() => ({
      where: {
        travelAuthorizationId: this.travelAuthorizationId,
        type: TYPES.EXPENSE,
      },
    }))
    const { expenses, isLoading, fetch: refresh } = useExpenses(expenseOptions)

    return {
      expenses,
      isLoading,
      refresh,
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
    async refreshExpenseCreationDependencies() {
      await Promise.all([
        this.refresh(),
        this.$refs.expensesTable.refresh(),
        this.$refs.mealsAndIncidentalsTable.refresh(),
        this.$refs.totalsTable.refresh(),
        await this.$refs.requestApprovalForm.refresh(),
      ])
    },
    async refreshExpenseChangedDependencies() {
      await Promise.all([
        this.$refs.totalsTable.refresh(),
        await this.$refs.requestApprovalForm.refresh(),
      ])
    },
    async refreshCodingsCreatedDependencies() {
      await Promise.all([
        await this.$refs.codingsTable.refresh(),
        await this.$refs.requestApprovalForm.refresh(),
      ])
    },
    async refreshCodingsChangedDependencies() {
      await this.$refs.requestApprovalForm.refresh()
    },
  },
}
</script>
