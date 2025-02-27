<template>
  <FlightReconciliationsDataTable
    ref="flightReconciliationsDataTable"
    v-model="selectedFlightReconciliations"
    :filters="filters"
    show-select
  >
    <template #top="{ order }">
      <v-row>
        <v-spacer />
        <v-col
          cols="12"
          md="3"
        >
          <ExportToCsvButton
            :flight-reconciliation-ids="selectedFlightReconciliationIds"
            :order="order"
            :disabled="isEmpty(selectedFlightReconciliationIds)"
            color="primary"
            block
          />
        </v-col>
      </v-row>
    </template>
  </FlightReconciliationsDataTable>
</template>

<script setup>
import { computed, ref } from "vue"
import { isNil, isEmpty } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import FlightReconciliationsDataTable from "@/components/flight-reconciliations/FlightReconciliationsDataTable.vue"
import ExportToCsvButton from "@/components/flight-reconciliations/ExportToCsvButton.vue"

const props = defineProps({
  startDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
})

const filters = computed(() => {
  if (
    isNil(props.startDate) ||
    isEmpty(props.startDate) ||
    isNil(props.endDate) ||
    isEmpty(props.endDate)
  ) {
    return {}
  }

  return {
    invoiceBookingDateBetween: [props.startDate, props.endDate],
  }
})

const selectedFlightReconciliations = ref([])
const selectedFlightReconciliationIds = computed(() =>
  selectedFlightReconciliations.value.map((flightReconciliation) => flightReconciliation.id)
)

/** @type {import("vue").Ref<InstanceType<typeof FlightReconciliationsDataTable> | null>} */
const flightReconciliationsDataTable = ref(null)

async function refresh() {
  await flightReconciliationsDataTable.value?.refresh()
}

defineExpose({
  refresh,
})

useBreadcrumbs([
  {
    text: "Flight Expenses",
    to: {
      name: "flight-expenses/AllFlightExpensesPage",
    },
  },
  {
    text: "All Flights Expenses",
    to: {
      name: "flight-expenses/AllFlightExpensesPage",
    },
  },
])
</script>

<style scoped>
::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
