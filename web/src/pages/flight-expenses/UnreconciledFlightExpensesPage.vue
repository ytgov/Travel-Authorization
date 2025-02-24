<template>
  <AccountsReceivableInvoiceDetailsDataTable
    ref="accountsReceivableInvoiceDetailsDataTable"
    v-model="selectedAccountsReceivableInvoiceDetails"
    :filters="filters"
    unreconciled
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
            :disabled="isEmpty(selectedAccountsReceivableInvoiceDetails)"
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
          <FlightReconciliationsCreateDialog
            :selected-accounts-receivable-invoice-details="selectedAccountsReceivableInvoiceDetails"
            :activator-props="{
              disabled: isEmpty(selectedAccountsReceivableInvoiceDetails),
              block: true,
            }"
            @created="refresh"
          />
        </v-col>
      </v-row>
    </template>
  </AccountsReceivableInvoiceDetailsDataTable>
</template>

<script setup>
import { computed, ref } from "vue"
import { ExportToCsv } from "export-to-csv"
import { isNil, isEmpty } from "lodash"

import AccountsReceivableInvoiceDetailsDataTable from "@/components/trav-com/accounts-receivable-invoice-details/AccountsReceivableInvoiceDetailsDataTable.vue"
import FlightReconciliationsCreateDialog from "@/components/flight-reconciliations/FlightReconciliationsCreateDialog.vue"

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

const selectedAccountsReceivableInvoiceDetails = ref([])

async function exportToExcel() {
  const csvInfo = selectedAccountsReceivableInvoiceDetails.value.map((flight) => {
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

/** @type {import("vue").Ref<InstanceType<typeof AccountsReceivableInvoiceDetailsDataTable> | null>} */
const accountsReceivableInvoiceDetailsDataTable = ref(null)

function refresh() {
  accountsReceivableInvoiceDetailsDataTable.value?.refresh()
}
</script>

<style scoped>
::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
