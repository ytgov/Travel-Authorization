<template>
  <AccountsReceivableInvoiceDetailsDataTable
    v-model="selectedFlights"
    :filters="filters"
    unreconciled
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
            @click="openReconcile"
          >
            Reconcile
          </v-btn>
        </v-col>
      </v-row>

      <!-- TODO: make dialog into a separate component -->
      <v-dialog
        v-model="reconcileDialog"
        persistent
        max-width="400px"
      >
        <v-card>
          <v-card-title
            class="primary"
            style="border-bottom: 1px solid black"
          >
            <div class="text-h5">Reconcile Flights</div>
          </v-card-title>

          <v-card-text>
            <v-select
              v-model="period"
              :items="periodOptions"
              :rules="[required]"
              class="mt-5"
              label="What Period?"
              outlined
              required
            >
            </v-select>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="grey darken-5"
              @click="reconcileDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              class="ml-auto"
              :loading="savingData"
              color="green darken-1"
              @click="addPeriod"
            >
              Reconcile
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
import { isNil, isEmpty, range } from "lodash"

import http from "@/api/http-client"
import { FLIGHT_RECONCILE_URL } from "@/urls"

import { required } from "@/utils/validators"

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

const reconcileDialog = ref(false)
const savingData = ref(false)

const period = ref(null)
const periodOptions = ref(range(1, 13)) // [1,2, ..., 12]

function openReconcile() {
  period.value = null
  savingData.value = false
  reconcileDialog.value = true
}

async function addPeriod() {
  if (isNil(period.value)) return

  savingData.value = true
  const body = []
  for (const flight of selectedFlights.value) {
    const reconcile = {
      invoiceID: flight.invoiceID,
      invoiceDetailID: flight.invoiceDetailID,
      reconciled: true,
      reconcilePeriod: period.value,
    }
    if (flight.reconcileID) {
      reconcile.reconcileID = flight.reconcileID
    }
    body.push(reconcile)
  }

  try {
    await http.post(`${FLIGHT_RECONCILE_URL}/`, body)
    reconcileDialog.value = false
  } catch (error) {
    console.log(`Failed to reconcile flight expenses: ${error}`)
  } finally {
    savingData.value = false
  }
}

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
</script>

<style scoped>
::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
