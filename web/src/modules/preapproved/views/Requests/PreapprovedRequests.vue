<template>
  <div class="mx-10 mb-5">
    <v-row class="my-0 mx-0">
      <submit-travel
        v-if="admin"
        :disabled="selectedRequests.length == 0"
        :travelRequests="travelRequests"
        :selectedRequests="selectedRequests"
        :preTSubID="0"
        @updateTable="updateTable"
        buttonName="Submit Selected Travel"
        class="ml-auto"
      />
      <print-report
        v-if="admin"
        :disabled="selectedRequests.length == 0"
        :travelRequests="selectedRequests"
        buttonName="Print Report"
      />
      <v-btn
           v-if="admin"
          :disabled="selectedRequests.length == 0"        
          @click="exportToExcel()"          
          class="mr-5 my-7"
          elevation="5"
          color="primary"          
        >
          Export To Excel
      </v-btn>
      <new-travel-request type="Add New" @updateTable="updateTable" :class="admin ? '' : 'ml-auto'" />
    </v-row>
    <v-data-table
      :headers="headers"
      :items="grayedOutTravelRequests"
      :items-per-page="5"
      class="elevation-1"
      v-model="selectedRequests"
      item-key="preTID"
      :show-select="admin"
      @item-selected="applySameDeptSelection"
      @toggle-select-all="applyAllSameDeptSelection"
    >
      <template v-slot:item.name="{ item }">
        <v-tooltip top color="primary">
          <template v-slot:activator="{ on }">
            <div v-on="item.travelers.length > 1 ? on : ''">
              <span>
                {{ item.travelers[0].fullName.replace(".", " ") }}
              </span>
              <span v-if="item.travelers.length > 1">, ... </span>
            </div>
          </template>
          <span
            ><div v-for="(trv, inx) in item.travelers" :key="inx">
              {{ trv.fullName.replace(".", " ") }}
            </div></span
          >
        </v-tooltip>
      </template>

      <template v-slot:item.travelDate="{ item }">
        <div v-if="item.dateUnkInd">
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

      <template v-slot:item.edit="{ item }">
        <new-travel-request
          :type="item.status == 'Draft' || !item.status ? 'Edit' : 'View'"
          @updateTable="updateTable"
          :travelRequest="item"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Vue from "vue";
import NewTravelRequest from "./NewTravelRequest.vue";
import PrintReport from "../Common/PrintReport.vue";
import SubmitTravel from "../Common/SubmitTravel.vue";
import { ExportToCsv } from 'export-to-csv';

export default {
  components: {
    NewTravelRequest,
    PrintReport,
    SubmitTravel
  },
  name: "PreapprovedRequests",
  props: {
    travelRequests: {
      type: []
    }
  },
  data() {
    return {
      headers: [
        {
          text: "Name",
          value: "name",
          class: "blue-grey lighten-4"
        },
        {
          text: "Department",
          value: "department",
          class: "blue-grey lighten-4"
        },
        {
          text: "Branch",
          value: "branch",
          class: "blue-grey lighten-4"
        },
        {
          text: "TravelDate",
          value: "travelDate",
          class: "blue-grey lighten-4"
        },
        {
          text: "Location",
          value: "location",
          class: "blue-grey lighten-4"
        },
        {
          text: "Purpose Type",
          value: "purpose",
          class: "blue-grey lighten-4"
        },
        {
          text: "Reason",
          value: "reason",
          class: "blue-grey lighten-4"
        },
        {
          text: "Status",
          value: "status",
          class: "blue-grey lighten-4"
        },
        {
          text: "",
          value: "edit",
          class: "blue-grey lighten-4",
          cellClass: "px-0 mx-0",
          sortable: false,
          width: "1rem"
        }
      ],
      admin: false,
      selectedRequests: [],
      firstSelectionDept: ""
    };
  },
  mounted() {
    this.admin = Vue.filter("isAdmin")();
  },
  computed: {
    grayedOutTravelRequests() {
      const travelRequests = JSON.parse(JSON.stringify(this.travelRequests));
      if(this.firstSelectionDept)
        travelRequests.forEach(req => {
            req.isSelectable= req.isSelectable? (req.department==this.firstSelectionDept) :false
        });
      return travelRequests
    }
  },
  methods: {
    updateTable() {
      this.$emit("updateTable");
    },
    applySameDeptSelection(selection) {
      Vue.nextTick(() => {
        if (this.selectedRequests.length == 1) {
          this.firstSelectionDept = this.selectedRequests[0].department;
        } else if (this.selectedRequests.length == 0) {
          this.firstSelectionDept = "";
        }

        if (selection.value == true && selection.item.department != this.firstSelectionDept) {
          this.selectedRequests = this.selectedRequests.filter(req => req.preTID != selection.item.preTID);
        }
      });
    },
    applyAllSameDeptSelection(selection) {
      console.log(selection);
      Vue.nextTick(() => {
        if (selection.value == true && this.firstSelectionDept) {
          this.selectedRequests = this.selectedRequests.filter(req => req.department == this.firstSelectionDept);
        } else {
          this.selectedRequests = [];
          this.firstSelectionDept = "";
        }
      });
    },
    exportToExcel(){
      // console.log(this.selectedRequests)
      const csvInfo = this.selectedRequests.map(req =>{
        return {
          travelers: req.travelers?.map(trv=>trv.fullName.replace(".", " "))?.join(', '),
          department: req.department,
          branch: (req.branch? req.branch:''),
          travelDate: (req.dateUnkInd? req.month:(req.startDate +' '+ req.endDate)),
          location: req.location,          
          purpose: (req.purpose? req.purpose :''),
          estimatedCost: req.estimatedCost,
          reason: (req.reason? req.reason :''),
          status: (req.status? req.status :''),
          travelerNotes: (req.travelerNotes? req.travelerNotes :'')
        }
      })
      const options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalSeparator: '.',
          showLabels: true, 
          showTitle: false,
          title: '',
          filename: 'Preapproved-Travel-Requests',
          useTextFile: false,
          useBom: true,
          useKeysAsHeaders: false,
          headers: ['Name', 'Department', 'Branch', 'Travel Date', 'Location', 'Purpose', 'Estimated Cost', 'Reason', 'Status', 'Notes']
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(csvInfo);
    }
  }
};
</script>

<style scoped>
::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
