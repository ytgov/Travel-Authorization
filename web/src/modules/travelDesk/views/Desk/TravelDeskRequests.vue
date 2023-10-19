<template>
  <div
    class="mx-10 mb-5"
    v-if="tdUser"
  >
    <v-row
      class="my-0 mx-0"
      :key="update"
    >
      <print-travel-desk-report
        class="ml-auto"
        :disabled="selectedRequests.length == 0"
        :travelDeskRequests="selectedRequests"
        buttonName="Print Report"
        @update="update++"
      />
      <v-btn
        :disabled="selectedRequests.length == 0"
        @click="exportToExcel()"
        class="ml-3 mr-2 my-7"
        elevation="5"
        color="primary"
      >
        Export To Excel
      </v-btn>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="travelDeskRequests"
      :sort-by="['bookedStatus', 'userTravel', 'startDate']"
      :sort-desc="[false, true, false]"
      :item-class="itemRowBackground"
      multi-sort
      :items-per-page="15"
      v-model="selectedRequests"
      show-select
      item-key="id"
      class="elevation-1 mt-4"
    >
      <template #item.submit-date="{ item }">
        <div>
          {{ item.submitDate | beautifyDate }}
        </div>
      </template>

      <template #item.fullname="{ item }">
        {{ item.form.firstName + " " + item.form.lastName }}
      </template>

      <template #item.department="{ item }">
        {{ item.form.department }}
      </template>

      <template #item.branch="{ item }">
        {{ item.form.branch }}
      </template>

      <template #item.start-date="{ item }">
        <div>
          {{ item.startDate | beautifyDate }}
        </div>
      </template>

      <template #item.end-date="{ item }">
        <div>
          {{ item.form.dateBackToWork | beautifyDate }}
        </div>
      </template>

      <template #item.location="{ item }">
        {{ getLocationName(item.form.stops) }}
      </template>

      <template #item.requested="{ item }">
        {{ getRequested(item) }}
      </template>

      <template #item.status="{ item }">
        <div v-if="item.status == 'submitted' && !item.travelDeskOfficer">
          Not started <v-icon class="red--text">mdi-flag</v-icon>
        </div>
        <div v-else>
          {{ item.status | getTravelStatus }}
          <v-icon
            v-if="item.status == 'submitted'"
            class="red--text"
            >mdi-flag</v-icon
          >
          <v-icon
            v-if="item.status == 'options_ranked'"
            class="yellow--text"
            >mdi-flag</v-icon
          >
          <v-icon
            v-else-if="item.status == 'booked'"
            class="green--text"
            >mdi-checkbox-marked</v-icon
          >
        </div>
      </template>

      <template #item.edit="{ item }">
        <process-travel-desk-request
          :type="item.status == 'booked' ? 'booked' : 'edit'"
          @updateTable="updateTable()"
          :travelDetail="item"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Vue from "vue"
import ProcessTravelDeskRequest from "./ProcessTravelDeskRequest.vue"
import PrintTravelDeskReport from "../Common/PrintTravelDeskReport.vue"
import { ExportToCsv } from "export-to-csv"

export default {
  components: {
    ProcessTravelDeskRequest,
    PrintTravelDeskReport,
  },
  name: "TravelDeskRequests",
  props: {
    travelDeskRequests: {},
  },
  data() {
    return {
      headers: [
        { text: "Submit Date", value: "submitDate", class: "blue-grey lighten-4" },
        { text: "Name", value: "fullname", class: "blue-grey lighten-4", sortable: false },
        { text: "Department", value: "department", class: "blue-grey lighten-4" },
        { text: "Branch", value: "branch", class: "blue-grey lighten-4" },
        { text: "Travel Start Date", value: "startDate", class: "blue-grey lighten-4" },
        {
          text: "Travel End Date",
          value: "endDate",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        { text: "Location", value: "location", class: "blue-grey lighten-4" },
        { text: "Requested", value: "requested", class: "blue-grey lighten-4" },
        { text: "Status", value: "status", class: "blue-grey lighten-4" },
        { text: "Travel Desk Officer", value: "travelDeskOfficer", class: "blue-grey lighten-4" },
        {
          text: "",
          value: "edit",
          class: "blue-grey lighten-4",
          cellClass: "px-0 mx-0",
          sortable: false,
        },
      ],
      admin: false,
      department: "",
      selectedRequests: [],
      update: 0,
      tdUser: false,
    }
  },
  mounted() {
    this.tdUser = Vue.filter("isTdUser")()
  },
  computed: {},
  methods: {
    updateTable() {
      this.$emit("updateTable")
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
      if (item.otherTransportation?.length > 0) requested.push("transportation")

      return requested.join(", ")
    },

    itemRowBackground: function (item) {
      return item.userTravel > 0 ? "red lighten-5" : ""
    },

    exportToExcel() {
      console.log(this.selectedRequests)
      const csvInfo = this.selectedRequests.map((req) => {
        return {
          submitDate: req.submitDate.slice(0, 10),
          name: req.form.firstName + " " + req.form.lastName,
          department: req.form.department,
          branch: req.form.branch ? req.form.branch : "",
          travelStartDate: req.startDate.slice(0, 10),
          travelEndDate: req.form.dateBackToWork.slice(0, 10),
          location: this.getLocationName(req.form.stops),
          requested: this.getRequested(req),
          status:
            req.status == "submitted" && !req.travelDeskOfficer
              ? "Not started"
              : Vue.filter("getTravelStatus")(req.status),
          travelDeskOfficer: req.travelDeskOfficer ? req.travelDeskOfficer : "",
        }
      })
      const options = {
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        showTitle: false,
        title: "",
        filename: "Travel-Desk-Requests",
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: false,
        headers: [
          "Submit Date",
          "Name",
          "Department",
          "Branch",
          "Travel Start Date",
          "Travel End Date",
          "Location",
          "Requested",
          "Status",
          "Travel Desk Officer",
        ],
      }
      const csvExporter = new ExportToCsv(options)
      csvExporter.generateCsv(csvInfo)
    },
  },
}
</script>

<style scoped>
::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
