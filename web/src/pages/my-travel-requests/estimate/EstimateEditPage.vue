<template>
  <div class="mt-4">
    <div class="d-flex justify-end">
      <EstimateCreateDialog
        v-if="hasEstimates"
        :travel-authorization-id="travelAuthorizationIdAsNumber"
        @created="refreshEstimates"
      />
      <EstimateGenerateDialog
        v-else
        :travel-authorization-id="travelAuthorizationIdAsNumber"
        @created="refreshEstimates"
      />
    </div>

    <EstimatesTable
      ref="estimatesTable"
      :travel-authorization-id="travelAuthorizationIdAsNumber"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue"

import { TYPES as EXPENSE_TYPES } from "@/api/expenses-api"
import useExpenses from "@/use/use-expenses"

import EstimateCreateDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-estimate-page/EstimateCreateDialog"
import EstimateGenerateDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-estimate-page/EstimateGenerateDialog"
import EstimatesTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-estimate-page/EstimatesTable"

/**
 * @template [T=any]
 * @typedef {import("vue").Ref<T>} Ref
 */

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

const expensesQuery = computed(() => ({
  where: {
    travelAuthorizationId: travelAuthorizationIdAsNumber.value,
    type: EXPENSE_TYPES.ESTIMATE,
  },
}))
const { expenses: estimates, isLoading } = useExpenses(expensesQuery)
const hasEstimates = computed(() => isLoading.value === false && estimates.value.length > 0)

/** @type {Ref<InstanceType<typeof EstimatesTable> | null>} */
const estimatesTable = ref(null)

async function refreshEstimates() {
  await estimatesTable.value?.refresh()
}
</script>
