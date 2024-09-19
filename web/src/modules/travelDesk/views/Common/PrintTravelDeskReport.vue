<template>
  <div>
    <v-dialog
      v-model="printReportDialog"
      persistent
      max-width="950px"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          :disabled="disabled"
          color="primary"
          v-bind="attrs"
          class="my-0"
          @click="initPrint()"
          v-on="on"
          >{{ buttonName }}
        </v-btn>
      </template>

      <v-card
        v-if="!loadingData"
        class="px-10 py-5"
      >
        <v-row
          class="mb-3"
          justify="space-around"
        >
          <v-col cols="5" />
          <v-col cols="2">
            <v-btn
              color="secondary"
              @click="print"
            >
              Print
              <v-icon
                class="ml-2"
                color="primary darken-2"
                >mdi-printer</v-icon
              >
            </v-btn>
          </v-col>
          <v-col cols="3" />
          <v-col
            cols="2"
            align="right"
          >
            <v-btn
              color="grey"
              @click="closeModal()"
              >Close</v-btn
            >
          </v-col>
        </v-row>

        <div id="pdf-page">
          <v-app-bar
            color="#fff"
            flat
            height="70"
            style="left: 0; border-bottom: 3px #f3b228 solid"
          >
            <img
              src="/yukon.svg"
              style="margin: -1.2rem -10rem 0 0"
              height="44"
            />
            <div style="margin: 0 auto !important; font-size: 14pt !important">
              <b>Out-of-Territory Travel Desk Report</b>
            </div>
          </v-app-bar>
          <div
            v-for="page in pages"
            :key="'pdf-page-' + page"
          >
            <v-data-table
              style="margin: 1rem 0"
              dense
              :headers="headers"
              :items="printRequests"
              :items-per-page="10"
              :page="page"
              class="elevation-1"
              hide-default-footer
            >
              <template #item.createdAt="{ item }">
                <div>
                  {{ item.createdAt | beautifyDate }}
                </div>
              </template>

              <template #item.fullname="{ item }">
                {{ item.legalFirstName + " " + item.legalLastName }}
              </template>

              <template #item.department="{ item }">
                {{ item.travelAuthorization.department }}
              </template>

              <template #item.branch="{ item }">
                {{ item.travelAuthorization.branch }}
              </template>

              <template #item.startDate="{ item }">
                <div>
                  {{ item.startDate | beautifyDate }}
                </div>
              </template>

              <template #item.endDate="{ item }">
                <div>
                  {{ item.travelAuthorization.dateBackToWork | beautifyDate }}
                </div>
              </template>

              <template #item.location="{ item }">
                {{ getLocationName(item.travelAuthorization.stops) }}
              </template>

              <template #item.requested="{ item }">
                {{ getRequested(item) }}
              </template>

              <template #item.status="{ item, value }">
                <div
                  v-if="
                    value === TRAVEL_DESK_TRAVEL_REQUEST_STATUSES.SUBMITTED &&
                    isNil(item.travelDeskOfficer)
                  "
                >
                  Not started
                </div>
                <div v-else>
                  {{ t(`travel_desk_travel_request.status.${value}`, { $default: value }) }}
                </div>
              </template>
            </v-data-table>

            <div style="font-size: 7pt; text-align: right">
              <i>Page {{ page }} of {{ pages.length }}</i>
            </div>
            <div class="new-page" />
          </div>

          <div
            style="font-size: 7pt"
            class="form-footer"
          >
            <i>Printed on: {{ currentDate }}</i>
          </div>
        </div>

        <div class="mt-10" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue"
import { isNil } from "lodash"
import { Printd } from "printd"

import { useI18n } from "@/plugins/vue-i18n-plugin"
import { TRAVEL_DESK_TRAVEL_REQUEST_STATUSES } from "@/api/travel-desk-travel-requests-api"

export default {
  name: "PrintTravelDeskReport",
  components: {},
  props: {
    buttonName: {
      type: String,
      required: true,
    },
    travelDeskRequests: {
      type: Array,
      required: true,
    },
    disabled: { type: Boolean, default: false },
  },
  setup() {
    const { t } = useI18n()
    return {
      TRAVEL_DESK_TRAVEL_REQUEST_STATUSES,
      isNil,
      t,
    }
  },
  data() {
    return {
      headers: [
        { text: "Submit Date", value: "createdAt", class: "m-0 p-0" },
        { text: "Name", value: "fullname", class: "m-0 p-0", sortable: false },
        { text: "Department", value: "department", class: "m-0 p-0" },
        { text: "Branch", value: "branch", class: "m-0 p-0", sortable: false },
        { text: "Travel Start Date", value: "startDate", class: "m-0 p-0" },
        { text: "Travel End Date", value: "endDate", class: "m-0 p-0", sortable: false },
        { text: "Location", value: "location", class: "m-0 p-0" },
        { text: "Requested", value: "requested", class: "m-0 p-0" },
        { text: "Status", value: "status", class: "m-0 p-0" },
        { text: "Travel Desk Officer", value: "travelDeskOfficer", class: "m-0 p-0" },
      ],

      printReportDialog: false,
      printRequests: [],
      currentDate: "",
      pages: [],
      loadingData: false,
    }
  },
  mounted() {},
  methods: {
    initPrint() {
      this.loadingData = true
      // console.log("Print");
      // this.printRequests=[]
      this.currentDate = new Date().toDateString()
      this.printRequests = JSON.parse(JSON.stringify(this.travelDeskRequests))

      this.pages = []
      for (let index = 1; index < this.printRequests.length / 10 + 1; index++) {
        this.pages.push(index)
      }

      Vue.nextTick(() => (this.loadingData = false))
    },

    print() {
      const styles = [
        `@media print {
                        @page {
                            size: letter landscape !important;
                        }
                        div.form-footer {
                            position: fixed;
                            bottom: 0;
                            width:100%;
                            display:inline-block;
                        }
                        .new-page{
                            page-break-before: always;
                            position: relative; top: 8em;
                        }

                    }`,
        `https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css`,
        `thead th {
                        font-size: 11pt !important;
                        color: #111111 !important;
                        text-align: center !important;
                        border:  1px solid #333334 !important;
                        border-bottom: 2px solid #333334 !important;
                    }`,
        `tbody td { border:  1px solid #666666 !important;}`,
        `table {border: 2px solid #333334;}`,
      ]

      const pdf_id = "pdf-page"
      const pageToPrint = window.document.getElementById(pdf_id)

      if (pageToPrint) {
        const pdf = new Printd()
        pdf.print(pageToPrint, styles)
        this.closeModal()
      }
    },
    getLocationName(stops) {
      const names = []
      const destinations = this.$store.state.traveldesk.destinations
      for (const stop of stops) {
        const location = destinations.filter((dest) => dest.value == stop.locationId)
        if (location.length > 0) {
          names.push(location[0].text)
        }
      }
      return names.join(", ")
    },

    getRequested(item) {
      const requested = []
      if (item.flightRequests?.length > 0) requested.push("flight")
      if (item.hotels?.length > 0) requested.push("hotel")
      if (item.rentalCars?.length > 0) requested.push("rental car")
      if (item.otherTransportations?.length > 0) requested.push("transportation")

      return requested.join(", ")
    },
    closeModal() {
      this.printReportDialog = false
      this.$emit("update")
    },
  },
}
</script>

<style scoped>
::v-deep(tbody td) {
  font-size: 7.5pt !important;
  border: 1px solid #666666 !important;
}

::v-deep(tbody th) {
  font-size: 7pt !important;
}

::v-deep(thead th) {
  border: 1px solid #333334 !important;
  border-bottom: 2px solid #333334 !important;
  text-align: center !important;
  font-size: 9pt !important;
  color: #111111 !important;
}

::v-deep(table) {
  border: 2px solid #333334;
}

.form-footer {
  display: none;
}
</style>
