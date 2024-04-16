<template>
  <div class="mx-10 mb-5">
    <v-row class="my-0 mx-0">
      <SubmitTravel
        v-if="admin"
        :disabled="selectedRequests.length == 0"
        :travel-requests="travelRequests"
        :selected-requests="selectedRequests"
        :submission-id="0"
        button-name="Submit Selected Travel"
        class="ml-auto"
        @updateTable="updateTable"
      />
      <print-report
        v-if="admin"
        :disabled="selectedRequests.length == 0"
        :travel-requests="selectedRequests"
        button-name="Print Report"
      />
      <v-btn
        v-if="admin"
        :disabled="selectedRequests.length == 0"
        class="mr-5 my-7"
        color="primary"
        @click="exportToExcel"
      >
        Export To Excel
      </v-btn>
      <new-travel-request
        type="Add New"
        :class="admin ? '' : 'ml-auto'"
        @updateTable="updateTable"
      />
    </v-row>
    <v-data-table
      v-model="selectedRequests"
      :headers="headers"
      :items="grayedOutTravelRequests"
      :items-per-page="5"
      class="elevation-1"
      :show-select="admin"
      @item-selected="applySameDeptSelection"
      @toggle-select-all="applyAllSameDeptSelection"
    >
      <template #item.name="{ item }">
        <template v-if="item.profiles.length === 0"> Unspecified </template>
        <template v-else-if="item.profiles.length === 1">
          {{ item.profiles[0].profileName.replace(".", " ") }}
        </template>
        <v-tooltip
          v-else
          top
          color="primary"
        >
          <template #activator="{ on }">
            <div v-on="on">
              <span>
                {{ item.profiles[0].profileName.replace(".", " ") }}
              </span>
              <span>, ... </span>
            </div>
          </template>
          <span
            ><div
              v-for="(profile, index) in item.profiles"
              :key="index"
            >
              {{ profile.profileName.replace(".", " ") }}
            </div></span
          >
        </v-tooltip>
      </template>

      <template #item.travelDate="{ item }">
        <div v-if="item.isOpenForAnyDate">
          {{ item.month }}
        </div>
        <div v-else>
          <div>
            <!-- eslint-disable-next-line vue/no-parsing-error -->
            {{ item.startDate | beautifyDate }}
            to
          </div>
          <div>
            <!-- eslint-disable-next-line vue/no-parsing-error -->
            {{ item.endDate | beautifyDate }}
          </div>
        </div>
      </template>

      <template #item.edit="{ item }">
        <new-travel-request
          :type="item.status === STATUSES.DRAFT || isNil(item.status) ? 'Edit' : 'View'"
          :travel-request="item"
          @updateTable="updateTable"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Vue from "vue"
import { ExportToCsv } from "export-to-csv"
import { isNil } from "lodash"

import { STATUSES } from "@/api/travel-authorization-pre-approvals-api"

import NewTravelRequest from "./NewTravelRequest.vue"
import PrintReport from "../Common/PrintReport.vue"
import SubmitTravel from "../Common/SubmitTravel.vue"

export default {
  name: "PreapprovedRequests",
  components: {
    NewTravelRequest,
    PrintReport,
    SubmitTravel,
  },
  props: {
    travelRequests: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      headers: [
        {
          text: "Name",
          value: "name",
          class: "blue-grey lighten-4",
        },
        {
          text: "Department",
          value: "department",
          class: "blue-grey lighten-4",
        },
        {
          text: "Branch",
          value: "branch",
          class: "blue-grey lighten-4",
        },
        {
          text: "TravelDate",
          value: "travelDate",
          class: "blue-grey lighten-4",
        },
        {
          text: "Location",
          value: "location",
          class: "blue-grey lighten-4",
        },
        {
          text: "Purpose Type",
          value: "purpose",
          class: "blue-grey lighten-4",
        },
        {
          text: "Reason",
          value: "reason",
          class: "blue-grey lighten-4",
        },
        {
          text: "Status",
          value: "status",
          class: "blue-grey lighten-4",
        },
        {
          text: "",
          value: "edit",
          class: "blue-grey lighten-4",
          cellClass: "px-0 mx-0",
          sortable: false,
          width: "1rem",
        },
      ],
      admin: false,
      selectedRequests: [],
      firstSelectionDept: "",
    }
  },
  computed: {
    STATUSES() {
      return STATUSES
    },
    grayedOutTravelRequests() {
      const travelRequests = JSON.parse(JSON.stringify(this.travelRequests))
      if (this.firstSelectionDept)
        travelRequests.forEach((req) => {
          req.isSelectable = req.isSelectable ? req.department == this.firstSelectionDept : false
        })
      return travelRequests
    },
  },
  mounted() {
    this.admin = Vue.filter("isAdmin")()
  },
  methods: {
    isNil,
    updateTable() {
      this.$emit("updateTable")
    },
    applySameDeptSelection(selection) {
      Vue.nextTick(() => {
        if (this.selectedRequests.length == 1) {
          this.firstSelectionDept = this.selectedRequests[0].department
        } else if (this.selectedRequests.length == 0) {
          this.firstSelectionDept = ""
        }

        if (selection.value == true && selection.item.department != this.firstSelectionDept) {
          this.selectedRequests = this.selectedRequests.filter((req) => req.id != selection.item.id)
        }
      })
    },
    applyAllSameDeptSelection(selection) {
      console.log(selection)
      Vue.nextTick(() => {
        if (selection.value == true && this.firstSelectionDept) {
          this.selectedRequests = this.selectedRequests.filter(
            (req) => req.department == this.firstSelectionDept
          )
        } else {
          this.selectedRequests = []
          this.firstSelectionDept = ""
        }
      })
    },
    exportToExcel() {
      // console.log(this.selectedRequests)
      const csvInfo = this.selectedRequests.map((req) => {
        return {
          profiles: req.profiles
            ?.map((profile) => profile.profileName.replace(".", " "))
            ?.join(", "),
          department: req.department,
          branch: req.branch ? req.branch : "",
          travelDate: req.isOpenForAnyDate ? req.month : req.startDate + " " + req.endDate,
          location: req.location,
          purpose: req.purpose ? req.purpose : "",
          estimatedCost: req.estimatedCost,
          reason: req.reason ? req.reason : "",
          status: req.status ? req.status : "",
          travelerNotes: req.travelerNotes ? req.travelerNotes : "",
        }
      })
      const options = {
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        showTitle: false,
        title: "",
        filename: "Preapproved-Travel-Requests",
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: false,
        headers: [
          "Name",
          "Department",
          "Branch",
          "Travel Date",
          "Location",
          "Purpose",
          "Estimated Cost",
          "Reason",
          "Status",
          "Notes",
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
