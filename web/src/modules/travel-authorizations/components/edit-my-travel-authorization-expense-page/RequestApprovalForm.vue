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

import { required } from "@/utils/validators"
import travelAuthorizationsApi from "@/api/travel-authorizations-api"

import { useSnack } from "@/plugins/snack-plugin"
import { useTravelAuthorization } from "@/use/travel-authorization"
import { useGeneralLedgerCodings } from "@/use/general-ledger-codings"
import { useExpenses } from "@/use/expenses"

import SearchableUserEmailCombobox from "@/components/SearchableUserEmailCombobox"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

defineExpose({
  refresh,
})

const form = ref(null)
const snack = useSnack()

const {
  travelAuthorization,
  isLoading: isLoadingTravelAuthorization,
  fetch: fetchTravelAuthorization,
} = useTravelAuthorization()
const {
  generalLedgerCodings,
  isLoading: isLoadingGeneralLedgerCodings,
  fetch: fetchGeneralLedgerCodings,
} = useGeneralLedgerCodings()
const { expenses, isLoading: isLoadingExpenses, fetch: fetchExpenses } = useExpenses()

const isLoading = computed(
  () =>
    isLoadingTravelAuthorization.value ||
    isLoadingGeneralLedgerCodings.value ||
    isLoadingExpenses.value
)

const hasGeneralLedgerCodings = computed(() => generalLedgerCodings.value.length > 0)
const allExpensesHaveReceipts = computed(() =>
  expenses.value.every((expense) => expense.fileSize > 0)
)
const isReadyToSubmit = computed(
  () => hasGeneralLedgerCodings.value && allExpensesHaveReceipts.value
)

onMounted(async () => {
  await refresh()
})

async function refresh() {
  await Promise.all([
    await fetchTravelAuthorization(props.travelAuthorizationId),
    await fetchGeneralLedgerCodings({
      where: {
        travelAuthorizationId: props.travelAuthorizationId,
      },
    }),
    await fetchExpenses({
      where: {
        travelAuthorizationId: props.travelAuthorizationId,
      },
    }),
  ])
}

async function requestApprovalForExpenseClaim() {
  try {
    await travelAuthorizationsApi.expenseClaim(props.travelAuthorizationId, {
      supervisorEmail: travelAuthorization.value.supervisorEmail,
    })
    // TODO: build out read only view of Expenses page.
    // import { useRouter } from "vue2-helpers/vue-router"
    // const router = useRouter()
    // router.push({
    //   name: "ReadMyTravelAuthorizationExpensesPage",
    //   params: { travelAuthorizationId: this.travelAuthorizationId },
    // })
  } catch (error) {
    snack(error.message, { color: "error" })
  }
}
</script>
