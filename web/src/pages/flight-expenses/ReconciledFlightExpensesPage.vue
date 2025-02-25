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
          <v-btn
            :disabled="isEmpty(selectedFlightReconciliations)"
            color="primary"
            block
            @click="exportToExcel"
          >
            Export To Excel
          </v-btn>
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
import { ExportToCsv } from "export-to-csv"
import { isNil, isEmpty } from "lodash"

import FlightReconciliationsDataTable from "@/components/flight-reconciliations/FlightReconciliationsDataTable.vue"
import FlightReconciliationsBulkUnreconcileDialog from "@/components/flight-reconciliations/FlightReconciliationsBulkUnreconcileDialog.vue"

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

// TODO: switch to back-end rendering at a dedicated endpoint via
// fast-csv, see https://github.com/icefoganalytics/internal-data-portal/blob/0eb01fff60c6b5d72b060f89e92cf15336225531/api/src/controllers/download/datasets-controller.ts#L28
async function exportToExcel() {
  const csvInfo = selectedFlightReconciliations.value.map((flight) => {
    return {
      purchaseDate: flight.purchaseDate ? flight.purchaseDate : "",
      cost: flight.cost ? "$" + flight.cost : "",
      agent: flight.agent ? flight.agent : "",
      airline: flight.airline ? flight.airline : "",
      flightInfo: flight.flightInfo ? flight.flightInfo : "",
      finalDestination: flight.finalDestination ? flight.finalDestination : "",
      department: flight.dept ? flight.dept : "",
      travelerFirstName: flight.travelerFirstName ? flight.travelerFirstName : "",
      travelerLastName: flight.travelerLastName ? flight.travelerLastName : "",
      reconciled: flight.reconciled ? "Yes" : "No",
      reconcilePeriod: flight.reconcilePeriod ? flight.reconcilePeriod : "",
    }
  })
  const options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: false,
    title: "",
    filename: "Flights",
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: [
      "Purchase Date",
      "Cost",
      "Agent",
      "Airline",
      "Flight Info",
      "Final Destination",
      "Department",
      "Traveler First Name",
      "Traveler last Name",
      "Reconciled",
    ],
  }
  const csvExporter = new ExportToCsv(options)
  csvExporter.generateCsv(csvInfo)
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
