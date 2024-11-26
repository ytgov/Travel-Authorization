<template>
  <div class="mt-4">
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-end">
          <h3>Traveler Expenses</h3>

          <ExpenseCreateDialog
            v-if="hasExpenses"
            :form-id="travelAuthorizationIdAsNumber"
            @created="refreshExpenseCreationDependencies"
          />
          <ExpensePrefillDialog
            v-else
            :travel-authorization-id="travelAuthorizationIdAsNumber"
            @created="refreshExpenseCreationDependencies"
          />
        </div>

        <ExpensesTable
          ref="expensesTable"
          :travel-authorization-id="travelAuthorizationIdAsNumber"
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
          :travel-authorization-id="travelAuthorizationIdAsNumber"
        />
      </v-col>
      <v-col>
        <h3>Totals</h3>
        <TotalsTable
          ref="totalsTable"
          :travel-authorization-id="travelAuthorizationIdAsNumber"
          class="white"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-end">
          <h3>Coding</h3>

          <GeneralLedgerCodingCreateDialog
            :travel-authorization-id="travelAuthorizationIdAsNumber"
            @created="refreshCodingsCreatedDependencies"
          />
        </div>

        <GeneralLedgerCodingsTable
          ref="codingsTable"
          :travel-authorization-id="travelAuthorizationIdAsNumber"
          @changed="refreshCodingsChangedDependencies"
        />
      </v-col>
      <v-col cols="4"></v-col>
    </v-row>
    <v-row class="mt-12">
      <v-col>
        <RequestApprovalForm
          ref="requestApprovalForm"
          :travel-authorization-id="travelAuthorizationIdAsNumber"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, ref, toRefs } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useExpenses, { TYPES as EXPENSE_TYPES } from "@/use/use-expenses"
import useTravelAuthorization from "@/use/use-travel-authorization"

import ExpenseCreateDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ExpenseCreateDialog"
import ExpensePrefillDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ExpensePrefillDialog"
import ExpensesTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/ExpensesTable"
import GeneralLedgerCodingCreateDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/GeneralLedgerCodingCreateDialog.vue"
import GeneralLedgerCodingsTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/GeneralLedgerCodingsTable.vue"
import MealsAndIncidentalsTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/MealsAndIncidentalsTable.vue"
import RequestApprovalForm from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/RequestApprovalForm.vue"
import TotalsTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-expense-page/TotalsTable.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

const expenseOptions = computed(() => ({
  where: {
    travelAuthorizationId: travelAuthorizationIdAsNumber.value,
    type: EXPENSE_TYPES.EXPENSE,
  },
}))
const { expenses, isLoading, refresh } = useExpenses(expenseOptions)

const hasExpenses = computed(() => isLoading.value === false && expenses.value.length > 0)

const expensesTable = ref(null)
const mealsAndIncidentalsTable = ref(null)
const totalsTable = ref(null)
const codingsTable = ref(null)
const requestApprovalForm = ref(null)

async function refreshExpenseCreationDependencies() {
  await Promise.all([
    refresh(),
    expensesTable.value?.refresh(),
    mealsAndIncidentalsTable.value?.refresh(),
    totalsTable.value?.refresh(),
    requestApprovalForm.value?.refresh(),
  ])
}

async function refreshExpenseChangedDependencies() {
  await Promise.all([totalsTable.value?.refresh(), requestApprovalForm.value?.refresh()])
}

async function refreshCodingsCreatedDependencies() {
  await Promise.all([codingsTable.value?.refresh(), requestApprovalForm.value?.refresh()])
}

async function refreshCodingsChangedDependencies() {
  await requestApprovalForm.value?.refresh()
}

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const breadcrumbs = computed(() => [
  {
    text: "My Travel Requests",
    to: {
      name: "my-travel-requests/MyTravelRequestsPage",
    },
  },
  {
    text: travelAuthorization.value?.eventName || "loading ...",
    to: {
      name: "my-travel-requests/expense/ExpensePage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
  },
  {
    text: "Edit",
    to: {
      name: "my-travel-requests/expense/ExpenseEditPage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
  },
])
useBreadcrumbs(breadcrumbs)
</script>
