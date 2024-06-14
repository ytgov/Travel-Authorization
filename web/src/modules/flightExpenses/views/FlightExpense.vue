<template>
  <v-card
    :loading="loadingData"
    :disabled="loadingData"
    en
    class="px-5 pb-15"
  >
    <v-alert
      v-if="alertMsg"
      dense
      class="mt-5"
      color="warning"
      dismissible
      >{{ alertMsg }}</v-alert
    >
    <div
      v-if="loadingData"
      class="mt-10"
      style="text-align: center"
    >
      loading ...
    </div>
    <div v-else>
      <v-toolbar
        class=""
        height="100px"
        flat
      >
        <v-toolbar-title
          class="text-h6"
          style="width: 100%"
        >
          <v-row class="my-10 mx-1">
            <div
              style="width: 20%"
              class="text-h5"
            >
              Flight Expense
            </div>
            <div style="width: 20%" />
            <div style="width: 20%">
              <b
                style="float: right; font-weight: 300"
                class="mr-4"
                >Records Date Range :</b
              >
            </div>
            <div style="width: 15%">
              <v-text-field
                v-model="startDate"
                class="mx-2"
                :error="startDateErr"
                type="date"
                label="Start Date"
                dense
                outlined
                hide-details
                @input="
                  startDateErr = false
                  dataReady = false
                "
              />
            </div>
            <div style="width: 15%">
              <v-text-field
                v-model="endDate"
                class="mx-2"
                :error="endDateErr"
                type="date"
                label="End Date"
                dense
                outlined
                hide-details
                @input="
                  endDateErr = false
                  dataReady = false
                "
              />
            </div>
            <div style="width: 10%">
              <v-btn
                class="my-auto ml-5"
                color="primary"
                @click="search"
              >
                Search
              </v-btn>
            </div>
          </v-row>
        </v-toolbar-title>

        <template #extension>
          <v-tabs
            v-if="dataReady"
            v-model="tabs"
            active-class="primary--text teal lighten-5"
          >
            <v-tab>Flights</v-tab>
            <v-tab>Unreconciled</v-tab>
            <v-tab>Reconciled</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items
        v-if="dataReady"
        v-model="tabs"
      >
        <v-tab-item>
          <v-card flat>
            <flights :flights="flights" />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <un-reconciled-flights
              :un-reconciled-flights="unReconciledFlights"
              @updateTable="reloadData(1, false)"
            />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <reconciled-flights
              :reconciled-flights="reconciledFlights"
              @updateTable="reloadData(2, false)"
            />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-card>
</template>

<script>
import Vue from "vue"

import http from "@/api/http-client"
import { TRAVEL_COM_URL, PROFILE_URL } from "@/urls"
import Flights from "@/modules/flightExpenses/views/Flights.vue"
import ReconciledFlights from "@/modules/flightExpenses/views/Reconciled/ReconciledFlights.vue"
import UnReconciledFlights from "@/modules/flightExpenses/views/Unreconciled/UnReconciledFlights.vue"

export default {
  name: "FlightExpense",
  components: {
    Flights,
    ReconciledFlights,
    UnReconciledFlights,
  },
  data() {
    return {
      tabs: 0,
      flights: [],
      loadingData: false,
      reconciledFlights: [],
      unReconciledFlights: [],
      alertMsg: "",
      dataReady: false,
      startDate: "",
      startDateErr: false,
      endDate: "",
      endDateErr: false,
    }
  },
  async mounted() {
    this.endDate = new Date().toISOString().slice(0, 10)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30) //1 months
    this.startDate = startDate.toISOString().slice(0, 10)
    this.alertMsg = ""
    this.reloadData(0, true)
  },
  methods: {
    async getUserAuth() {
      return http
        .get(PROFILE_URL)
        .then((resp) => {
          this.$store.commit("auth/setUser", resp.data.user)
        })
        .catch((e) => {
          console.log(e)
        })
    },

    async getFlights() {
      return http
        .get(`${TRAVEL_COM_URL}/flights/${this.startDate}/${this.endDate}`)
        .then((resp) => {
          console.log(resp.data)
          this.flights = resp.data
        })
        .catch((e) => {
          console.log(e)
        })
    },

    extractFlights() {
      this.reconciledFlights = []
      this.unReconciledFlights = []

      for (const flight of this.flights) {
        if (flight.reconciled) {
          this.reconciledFlights.push(flight)
        } else {
          this.unReconciledFlights.push(flight)
        }
      }
    },

    async search() {
      this.startDateErr = this.startDate && this.startDate < this.endDate ? false : true
      this.endDateErr = this.endDate && this.endDate > this.startDate ? false : true
      if (this.startDateErr || this.endDateErr) {
        return
      }
      this.alertMsg = ""
      const start = new Date(this.startDate + "T01:00:00.000Z")
      const end = new Date(this.endDate + "T01:00:00.000Z")
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 60)
        this.alertMsg =
          "If the Date Range is over 60 days, all records may not be displayed. Please use a shorter Date Range."
      await this.reloadData(this.tabs, false)
    },

    async reloadData(tabs, auth) {
      this.dataReady = false
      this.loadingData = true
      if (auth) console.log(auth) //await this.getUserAuth();
      await this.getFlights()
      this.extractFlights()
      this.loadingData = false
      this.dataReady = true
      Vue.nextTick(() => (this.tabs = tabs))
    },
  },
}
</script>
