<template>
  <v-form
    ref="form"
    :loading="isLoading"
  >
    <v-row>
      <v-col
        cols="12"
        md="3"
      >
        <SearchableUserEmailCombobox
          v-model="travelAuthorization.supervisorEmail"
          :rules="[required]"
          label="Submit to"
          dense
          outlined
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
      >
        <v-btn
          v-if="isReadyToSubmit"
          :loading="isLoading"
          class="mt-0"
          color="primary"
          @click="requestApprovalForExpenseClaim"
        >
          Submit to Supervisor
        </v-btn>
        <v-tooltip
          v-else
          bottom
        >
          <template #activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on"
            >
              <v-btn
                class="mt-0"
                color="secondary"
                disabled
                >Submit to Supervisor
                <v-icon
                  class="ml-1"
                  small
                >
                  mdi-help-circle-outline
                </v-icon>
              </v-btn>
            </span>
          </template>
          <span
            >Submit becomes enabled when there are more than zero "Coding" rows, and all expenses
            have an associated upload/receipt.</span
          >
        </v-tooltip>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { onMounted, ref, computed } from "vue"
import { useRouter } from "vue2-helpers/vue-router"

import { required } from "@/utils/validators"

import { useSnack } from "@/plugins/snack-plugin"
import { useTravelAuthorization } from "@/use/use-travel-authorization"
import { useGeneralLedgerCodings } from "@/use/use-general-ledger-codings"
import { useExpenses, TYPES, EXPENSE_TYPES } from "@/use/use-expenses"

import SearchableUserEmailCombobox from "@/components/users/UserEmailSearchableCombobox.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const form = ref(null)
const snack = useSnack()
const router = useRouter()

const {
  travelAuthorization,
  isLoading: isLoadingTravelAuthorization,
  fetch: fetchTravelAuthorization,
  expenseClaim,
} = useTravelAuthorization(props.travelAuthorizationId)

const generalLedgerCodingOptions = computed(() => ({
  where: {
    travelAuthorizationId: props.travelAuthorizationId,
  },
}))
const {
  generalLedgerCodings,
  isLoading: isLoadingGeneralLedgerCodings,
  fetch: fetchGeneralLedgerCodings,
} = useGeneralLedgerCodings(generalLedgerCodingOptions)

const expenseOptions = computed(() => ({
  where: {
    travelAuthorizationId: props.travelAuthorizationId,
    type: TYPES.EXPENSE,
  },
}))
const { expenses, isLoading: isLoadingExpenses, fetch: fetchExpenses } = useExpenses(expenseOptions)

const isLoading = computed(
  () =>
    isLoadingTravelAuthorization.value ||
    isLoadingGeneralLedgerCodings.value ||
    isLoadingExpenses.value
)

const hasGeneralLedgerCodings = computed(() => generalLedgerCodings.value.length > 0)
const allRelevantExpensesHaveReceipts = computed(() =>
  expenses.value
    .filter((expense) => expense.expenseType !== EXPENSE_TYPES.MEALS_AND_INCIDENTALS)
    .every((expense) => expense.fileSize > 0)
)
const isReadyToSubmit = computed(
  () => hasGeneralLedgerCodings.value && allRelevantExpensesHaveReceipts.value
)

onMounted(async () => {
  await refresh()
})

async function refresh() {
  await Promise.all([
    await fetchTravelAuthorization(),
    await fetchGeneralLedgerCodings(),
    await fetchExpenses(),
  ])
}

async function requestApprovalForExpenseClaim() {
  try {
    await expenseClaim({
      supervisorEmail: travelAuthorization.value.supervisorEmail,
    })
    snack("Expense claim submitted for approval.", { color: "success" })
    router.push({
      name: "ReadMyTravelAuthorizationExpensePage",
      params: { travelAuthorizationId: props.travelAuthorizationId },
    })
  } catch (error) {
    snack(error.message, { color: "error" })
  }
}

defineExpose({
  refresh,
})
</script>
