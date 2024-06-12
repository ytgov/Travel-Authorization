<template>
  <v-card
    :loading="loadingData"
    class="pt-1"
    style="border: 0px solid red !important"
  >
    <v-row class="mt-n1 mx-0">
      <NewFlightRequest
        v-if="!readonly"
        :disabled="loadingData"
        :min-date="minDate"
        :max-date="maxDate"
        class="ml-auto mr-3"
        type="Add New"
        :flight-request="flightRequest"
        @updateTable="updateTable"
      />
    </v-row>
    <v-row
      v-if="!loadingData"
      class="mb-3 mx-0"
    >
      <v-col
        v-if="flightRequests?.length > 0"
        cols="12"
      >
        <v-data-table
          :headers="flightHeaders"
          :items="flightRequests"
          :expanded.sync="expanded"
          :show-expand="false"
          hide-default-footer
          class="elevation-1"
        >
          <template #expanded-item="{ item }">
            <td
              v-if="showFlightOptions"
              :colspan="6"
            >
              <!-- {{ item.flightOptions }} -->
              <v-row
                v-for="(flightOption, inx) in item.flightOptions"
                :key="'flight-' + flightOption.flightOptionID + '-' + inx"
              >
                <v-col>
                  <FlightOptionCard
                    :flight-option="flightOption"
                    :opt-len="item.flightOptions.length"
                    :travel-desk-user="travelDeskUser"
                  />
                </v-col>
              </v-row>
            </td>
          </template>

          <template #[`item.datePreference`]="{ item }">
            {{ item.datePreference | beautifyDateTime }}
          </template>

          <template #[`item.edit`]="{ item }">
            <v-row class="mx-0 py-0 mt-n6 mb-n6">
              <v-col cols="6">
                <NewFlightRequest
                  v-if="!readonly"
                  type="Edit"
                  :min-date="minDate"
                  :max-date="maxDate"
                  :flight-request="item"
                  @updateTable="updateTable"
                />
              </v-col>
              <v-col cols="6">
                <v-btn
                  v-if="!readonly"
                  style="min-width: 0"
                  color="transparent"
                  class="px-1 pt-2"
                  small
                  @click="removeFlight(item)"
                  ><v-icon
                    class=""
                    color="red"
                    >mdi-close</v-icon
                  >
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { TRAVEL_DESK_URL } from "@/urls"
import http from "@/api/http-client"

import NewFlightRequest from "@/modules/travelDesk/views/Requests/RequestDialogs/NewFlightRequest.vue"
import FlightOptionCard from "@/modules/travelDesk/views/Requests/RequestDialogs/FlightComponents/FlightOptionCard.vue"

export default {
  name: "TravelDeskFlightRequestsEditTable",
  components: {
    NewFlightRequest,
    FlightOptionCard,
  },
  props: {
    travelDeskTravelRequestId: {
      type: Number,
      default: () => null,
    },
    flightRequests: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    travelDeskUser: {
      type: Boolean,
      default: false,
    },
    showFlightOptions: {
      type: Boolean,
      default: false,
    },
    authorizedTravel: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      flightHeaders: [
        {
          text: "Depart Location",
          value: "departLocation",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        {
          text: "Arrive Location",
          value: "arriveLocation",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        { text: "Date", value: "date", class: "blue-grey lighten-4" },
        {
          text: "Time Preference",
          value: "timePreference",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        {
          text: "Seat Preference",
          value: "seatPreference",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        { text: "", value: "edit", class: "blue-grey lighten-4", width: "4rem", sortable: false },
      ],
      flightRequest: {},
      tmpId: 1,
      admin: false,
      travelerDetails: {},
      savingData: false,
      expanded: [true],
      loadingData: false,
      minDate: "",
      maxDate: "",
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    async updateTable(type) {
      if (type == "Add New") {
        // console.log(this.flightRequests)
        this.flightRequest.tmpId = this.tmpId
        this.flightRequests.push(JSON.parse(JSON.stringify(this.flightRequest)))
        this.tmpId++
        await this.saveFlightRequests()
      } else if (type == "Edit") {
        await this.saveFlightRequests()
      }
    },

    async initForm() {
      if (this.authorizedTravel?.startDate && this.authorizedTravel?.endDate) {
        this.minDate = this.authorizedTravel.startDate.slice(0, 10)
        this.maxDate = this.authorizedTravel.endDate.slice(0, 10)
      }
      if (this.travelDeskTravelRequestId) await this.loadFlightRequests()
      const flightRequest = {}
      flightRequest.id = null
      flightRequest.tmpId = null

      flightRequest.departLocation = ""
      flightRequest.arriveLocation = ""
      flightRequest.datePreference = ""
      flightRequest.timePreference = ""
      flightRequest.seatPreference = ""
      flightRequest.flightOptions = []
      // flightRequest.status="Requested";

      this.flightRequest = flightRequest
    },

    editFlight(item) {
      this.flightRequest = item
    },

    async removeFlight(item) {
      // console.log(item)
      let delIndex = -1
      if (item.id > 0)
        delIndex = this.flightRequests.findIndex((flight) => flight.id && flight.id == item.id)
      else
        delIndex = this.flightRequests.findIndex(
          (flight) => flight.tmpId && flight.tmpId == item.tmpId
        )
      // console.log(delIndex)
      if (delIndex >= 0) {
        this.flightRequests.splice(delIndex, 1)
        await this.saveFlightRequests()
      }
    },

    async loadFlightRequests() {
      this.loadingData = true

      return http
        .get(`${TRAVEL_DESK_URL}/flight-request/${this.travelDeskTravelRequestId}`)
        .then((resp) => {
          // console.log(resp.data)
          this.flightRequests.splice(0)
          for (const flightRequest of resp.data) this.flightRequests.push(flightRequest)
          this.loadingData = false
        })
        .catch((e) => {
          console.log(e)
          this.loadingData = false
        })
    },

    async saveFlightRequests() {
      this.loadingData = true
      const body = this.flightRequests

      return http
        .post(`${TRAVEL_DESK_URL}/flight-request/${this.travelDeskTravelRequestId}`, body)
        .then(() => {
          // console.log(resp)
          this.loadFlightRequests()
          this.loadingData = false
        })
        .catch((e) => {
          console.log(e)
          this.loadingData = false
        })
    },
  },
}
</script>

<style scoped>
::v-deep .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
  background: #f9f9f9 !important;
}
</style>
