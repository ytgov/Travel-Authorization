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
import { computed, ref, toRefs } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useExpenses, { TYPES as EXPENSE_TYPES } from "@/use/use-expenses"
import useTravelAuthorization from "@/use/use-travel-authorization"

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

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const breadcrumbs = computed(() => [
  {
    text: "My Travel Requests",
    to: {
      name: "MyTravelAuthorizationsPage",
    },
  },
  {
    text: travelAuthorization.value?.eventName || "loading ...",
    to: {
      name: "my-travel-requests/estimate/EstimatePage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
  },
  {
    text: "Edit",
    to: {
      name: "my-travel-requests/estimate/EstimateEditPage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
  },
])
useBreadcrumbs(breadcrumbs)
</script>
