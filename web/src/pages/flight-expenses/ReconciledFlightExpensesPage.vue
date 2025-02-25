<template>
  <FlightReconciliationsDataTable
    ref="flightReconciliationsDataTable"
    v-model="selectedFlightReconciliations"
    :filters="filters"
    :where="where"
    reconciled
    show-select
  >
    <template #top>
      <v-row>
        <v-spacer />
        <v-col
          cols="12"
          md="2"
        >
          <ExportToCsvButton
            :flight-reconciliation-ids="selectedFlightReconciliationIds"
            :disabled="isEmpty(selectedFlightReconciliationIds)"
            color="primary"
            block
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-btn
            color="primary"
            :disabled="isEmpty(selectedFlightReconciliationIds)"
            block
            @click="showBulkUnreconcileDialog(selectedFlightReconciliationIds)"
          >
            Unreconcile
          </v-btn>
        </v-col>
      </v-row>

      <!-- TODO: consider if I should support unreconciling on a per-row basis as well? -->
      <FlightReconciliationsBulkUnreconcileDialog
        ref="flightReconciliationsBulkUnreconcileDialog"
        @saved="refresh"
      />
    </template>
  </FlightReconciliationsDataTable>
</template>

<script setup>
import { computed, ref } from "vue"
import { isNil, isEmpty } from "lodash"

import FlightReconciliationsDataTable from "@/components/flight-reconciliations/FlightReconciliationsDataTable.vue"
import FlightReconciliationsBulkUnreconcileDialog from "@/components/flight-reconciliations/FlightReconciliationsBulkUnreconcileDialog.vue"
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
  const baseFilters = {}

  if (
    !isNil(props.startDate) &&
    !isEmpty(props.startDate) &&
    !isNil(props.endDate) &&
    !isEmpty(props.endDate)
  ) {
    baseFilters.invoiceBookingDateBetween = [props.startDate, props.endDate]
  }

  return baseFilters
})
const where = computed(() => ({
  reconciled: true,
}))

const selectedFlightReconciliations = ref([])

const selectedFlightReconciliationIds = computed(() =>
  selectedFlightReconciliations.value.map((flightReconciliation) => flightReconciliation.id)
)

/** @type {import("vue").Ref<InstanceType<typeof FlightReconciliationsBulkUnreconcileDialog> | null>} */
const flightReconciliationsBulkUnreconcileDialog = ref(null)

function showBulkUnreconcileDialog(flightReconciliationIds) {
  flightReconciliationsBulkUnreconcileDialog.value.show(flightReconciliationIds)
}

/** @type {import("vue").Ref<InstanceType<typeof FlightReconciliationsDataTable> | null>} */
const flightReconciliationsDataTable = ref(null)

function refresh() {
  flightReconciliationsDataTable.value?.refresh()
}
</script>

<style scoped>
::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
