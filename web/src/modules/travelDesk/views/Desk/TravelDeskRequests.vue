<template>
  <div>
    <div class="d-flex mb-4">
      <v-spacer />
      <print-travel-desk-report
        class="my-0 mr-4"
        :disabled="selectedRequests.length == 0"
        :travel-desk-requests="selectedRequests"
        button-name="Print Report"
        @update="update++"
      />
      <v-btn
        :disabled="selectedRequests.length == 0"
        class="my-0"
        color="primary"
        @click="exportToExcel()"
      >
        Export To Excel
      </v-btn>
    </div>

    <v-data-table
      v-model="selectedRequests"
      :headers="headers"
      :items="travelDeskRequests"
      :sort-by="['bookedStatus', 'userTravel', 'startDate']"
      :sort-desc="[false, true, false]"
      :item-class="itemRowBackground"
      multi-sort
      :items-per-page="15"
      show-select
      item-key="id"
    >
      <template #item.createdAt="{ item }">
        <div>
          {{ item.createdAt | beautifyDate }}
        </div>
      </template>

      <template #item.fullname="{ item }">
        {{
          [item.travelAuthorization.firstName, item.travelAuthorization.lastName]
            .filter(Boolean)
            .join(" ") || "Unknown"
        }}
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
        <div v-if="value == 'submitted' && !item.travelDeskOfficer">
          Not started <v-icon class="red--text">mdi-flag</v-icon>
        </div>
        <div v-else>
          {{ t(`travel_desk_travel_request.status.${value}`, { $default: value }) }}
          <v-icon
            v-if="value == 'submitted'"
            class="red--text"
            >mdi-flag</v-icon
          >
          <v-icon
            v-if="value == 'options_ranked'"
            class="yellow--text"
            >mdi-flag</v-icon
          >
          <v-icon
            v-else-if="value == 'booked'"
            class="green--text"
            >mdi-checkbox-marked</v-icon
          >
        </div>
      </template>

      <template #item.edit="{ item }">
        <process-travel-desk-request
          :type="item.status == 'booked' ? 'booked' : 'edit'"
          :travel-detail="item"
          @updateTable="updateTable()"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { ExportToCsv } from "export-to-csv"

import { useI18n } from "@/plugins/vue-i18n-plugin"
import ProcessTravelDeskRequest from "@/modules/travelDesk/views/Desk/ProcessTravelDeskRequest.vue"
import PrintTravelDeskReport from "@/modules/travelDesk/views/Common/PrintTravelDeskReport.vue"

export default {
  name: "TravelDeskRequests",
  components: {
    ProcessTravelDeskRequest,
    PrintTravelDeskReport,
  },
  props: {
    travelDeskRequests: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      headers: [
        { text: "Submit Date", value: "createdAt" },
        { text: "Name", value: "fullname", sortable: false },
        { text: "Department", value: "department" },
        { text: "Branch", value: "branch" },
        { text: "Travel Start Date", value: "startDate" },
        {
          text: "Travel End Date",
          value: "endDate",
          sortable: false,
        },
        { text: "Location", value: "location" },
        { text: "Requested", value: "requested" },
        { text: "Status", value: "status" },
        { text: "Travel Desk Officer", value: "travelDeskOfficer" },
        {
          text: "",
          value: "edit",
          cellClass: "px-0 mx-0",
          sortable: false,
        },
      ],
      admin: false,
      department: "",
      selectedRequests: [],
      update: 0,
    }
  },
  computed: {},
  mounted() {},
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
      if (item.otherTransportations?.length > 0) requested.push("transportation")

      return requested.join(", ")
    },

    itemRowBackground: function (item) {
      return item.userTravel > 0 ? "red lighten-5" : ""
    },

    exportToExcel() {
      console.log(this.selectedRequests)
      const csvInfo = this.selectedRequests.map((req) => {
        return {
          createdAt: req.createdAt.slice(0, 10),
          name: req.travelAuthorization.firstName + " " + req.travelAuthorization.lastName,
          department: req.travelAuthorization.department,
          branch: req.travelAuthorization.branch ? req.travelAuthorization.branch : "",
          travelStartDate: req.startDate.slice(0, 10),
          travelEndDate: req.travelAuthorization.dateBackToWork.slice(0, 10),
          location: this.getLocationName(req.travelAuthorization.stops),
          requested: this.getRequested(req),
          status:
            req.status == "submitted" && !req.travelDeskOfficer
              ? "Not started"
              : this.t(`travel_desk_travel_request.status.${req.status}`, { $default: req.status }),
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
