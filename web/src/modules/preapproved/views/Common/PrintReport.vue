<template>
  <div>
    <v-dialog
      v-model="printReportDialog"
      persistent
      max-width="950px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :disabled="disabled"
          @click="initPrint()"
          :small="buttonInsideTable"
          :class="buttonInsideTable ? 'my-0' : 'mr-5 my-7'"
          color="primary"
          v-bind="attrs"
          v-on="on"
        >
          {{ buttonName }}
        </v-btn>
      </template>

      <v-card class="px-10 py-5">
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
              @click="printReportDialog = false"
              >Close</v-btn
            >
          </v-col>
        </v-row>

        <div :id="'pdf-page-' + id">
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
              <b>Out-of-Territory Travel</b>
            </div>
          </v-app-bar>

          <v-data-table
            style="margin: 1rem 0"
            dense
            :headers="headers"
            :items="printRequests"
            :items-per-page="5"
            class="elevation-1"
            hide-default-footer
          >
            <template v-slot:item.name="{ item }">
              <span> {{ item.department }}, </span>
              <span
                v-for="(trv, inx) in item.travelers"
                :key="inx"
                style="line-height: 1rem"
                >{{ trv.fullName.replace(".", " ") }}</span
              >
            </template>

            <template v-slot:item.travelDate="{ item }">
              <div v-if="item.dateUnkInd">
                {{ item.month }}
              </div>
              <div v-else>
                <div style="line-height: 1rem">
                  <!-- eslint-disable-next-line vue/no-parsing-error -->
                  {{ item.startDate | beautifyDate }}-
                </div>
                <div style="line-height: 1rem">
                  <!-- eslint-disable-next-line vue/no-parsing-error -->
                  {{ item.endDate | beautifyDate }}
                </div>
              </div>
            </template>
            <template v-slot:item.estimatedCost="{ item }">
              <div style="text-align: right !important">${{ item.estimatedCost | currency }}</div>
            </template>
            <template v-slot:body.append>
              <tr style="">
                <td
                  colspan="4"
                  style="border-top: 2px solid !important; font-size: 10pt !important"
                >
                  <b>Total</b>
                </td>
                <td
                  style="
                    border-top: 2px solid !important;
                    font-size: 10pt !important;
                    text-align: right !important;
                  "
                >
                  <b>${{ totalCost | currency }}</b>
                </td>
              </tr>
            </template>
          </v-data-table>

          <v-row style="margin-top: 3rem">
            <div style="width: 10%" />
            <div style="width: 40%; border-top: 1px solid #333333; font-size: 8pt">
              <v-row>
                <v-col
                  cols="2"
                  style="padding-right: 0"
                  >Approved:</v-col
                >
                <v-col style="padding-left: 0; margin-left: 0">
                  <input
                    style="width: 100%; cursor: pointer; padding-left: 0.25rem"
                    class="yellow darken-3"
                    v-model="approver"
                    clearable
                  />
                </v-col>
              </v-row>
            </div>
            <div style="width: 1%" />
            <div style="width: 10%; border-top: 1px solid #333333; font-size: 8pt">Date:</div>
          </v-row>
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
// import Vue from 'vue'
import { Printd } from "printd"

export default {
  components: {},
  name: "PrintReport",
  props: {
    buttonName: {
      type: String,
    },
    buttonInsideTable: {
      type: Boolean,
      default: false,
    },
    travelRequests: {
      type: [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      headers: [
        {
          text: "Date of Travel ",
          value: "travelDate",
          class: "m-0 p-0",
          width: "8.5rem",
        },
        {
          text: "Purpose",
          value: "purpose",
          class: "",
        },
        {
          text: "Location",
          value: "location",
          class: "",
        },
        {
          text: "Person/Position Travelling",
          value: "name",
          class: "",
        },
        {
          text: "Estimated Travel Cost",
          value: "estimatedCost",
          class: "m-0 p-0",
          width: "7.5rem",
        },
      ],
      printReportDialog: false,
      printRequests: [],
      totalCost: 0,
      approver: "",
      currentDate: "",
    }
  },
  mounted() {},
  methods: {
    initPrint() {
      console.log("Print")
      this.currentDate = new Date().toDateString()
      this.totalCost = 0
      for (const req of this.travelRequests) this.totalCost += req.estimatedCost
      this.printRequests = JSON.parse(JSON.stringify(this.travelRequests))
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

      const pdf_id = "pdf-page-" + this.id
      const pageToPrint = window.document.getElementById(pdf_id)

      if (pageToPrint) {
        const pdf = new Printd()
        pdf.print(pageToPrint, styles)
        this.printReportDialog = false
      }
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
