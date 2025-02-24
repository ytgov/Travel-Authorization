<template>
  <AccountsReceivableInvoiceDetailsDataTable
    v-model="selectedFlights"
    :filters="filters"
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
            :disabled="selectedFlights.length == 0"
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
            :disabled="selectedFlights.length == 0"
            color="primary"
            block
            @click="openUnReconcile"
          >
            UnReconcile
          </v-btn>
        </v-col>
      </v-row>

      <!-- TODO: make this a component -->
      <v-dialog
        v-model="unReconcileDialog"
        persistent
        max-width="400px"
      >
        <v-card>
          <v-card-title
            class="warning"
            style="border-bottom: 1px solid black"
          >
            <div class="text-h5">Unreconcile Flights</div>
          </v-card-title>

          <v-card-text class="mt-4">
            By Unreconciling these records, the period will be removed and the record will be
            returned to the reconcile list.
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="grey darken-5"
              @click="unReconcileDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              class="ml-auto"
              :loading="savingData"
              color="green darken-1"
              @click="unReconcile"
            >
              Continue
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </AccountsReceivableInvoiceDetailsDataTable>
</template>

<script setup>
import { computed, ref } from "vue"
import { ExportToCsv } from "export-to-csv"
import { isNil, isEmpty } from "lodash"

import http from "@/api/http-client"
import { FLIGHT_RECONCILE_URL } from "@/urls"

import AccountsReceivableInvoiceDetailsDataTable from "@/components/trav-com/accounts-receivable-invoice-details/AccountsReceivableInvoiceDetailsDataTable.vue"

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

const selectedFlights = ref([])

const unReconcileDialog = ref(false)
const savingData = ref(false)

// TODO: switch to back-end rendering at a dedicated endpoint via
// fast-csv, see https://github.com/icefoganalytics/internal-data-portal/blob/0eb01fff60c6b5d72b060f89e92cf15336225531/api/src/controllers/download/datasets-controller.ts#L28
async function exportToExcel() {
  const csvInfo = selectedFlights.value.map((flight) => {
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

function openUnReconcile() {
  savingData.value = false
  unReconcileDialog.value = true
}

async function unReconcile() {
  savingData.value = true
  try {
    const body = []
    for (const flight of selectedFlights.value) {
      const reconcile = {
        reconcileID: flight.reconcileID,
        invoiceID: flight.invoiceID,
        invoiceDetailID: flight.invoiceDetailID,
        reconciled: false,
        reconcilePeriod: null,
      }
      body.push(reconcile)
    }

    await http.post(`${FLIGHT_RECONCILE_URL}/`, body)

    unReconcileDialog.value = false
  } catch (error) {
    console.log(`Failed to unReconcile flight expenses: ${error}`)
  } finally {
    savingData.value = false
  }
}
</script>

<style scoped>
::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
