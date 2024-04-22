<template>
  <v-card
    :loading="isLoading"
    class="pt-1"
  >
    <div class="d-flex justify-end pr-4">
      <TravelDeskFlightRequestCreateDialog
        :loading="isLoading"
        :min-date="minDate"
        :max-date="maxDate"
        type="Add New"
        :flight-request="flightRequest"
        @updateTable="updateTable"
      />
    </div>
    <v-row class="mb-3 mx-0">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="flightRequests"
          hide-default-footer
          class="elevation-1"
        >
          <template #item.date="{ item }">
            {{ item.date | beautifyDateTime }}
          </template>

          <template #item.edit="{ item }">
            <v-row class="mx-0 py-0 mt-n6 mb-n6">
              <v-col cols="6">
                <TravelDeskFlightRequestCreateDialog
                  type="Edit"
                  :min-date="minDate"
                  :max-date="maxDate"
                  :flight-request="item"
                  @updateTable="updateTable"
                />
              </v-col>
              <v-col cols="6">
                <v-btn
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
import { secureGet, securePost } from "@/store/jwt"

import TravelDeskFlightRequestCreateDialog from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestCreateDialog.vue"

export default {
  name: "TravelDeskFlightRequestsEditTable",
  components: {
    TravelDeskFlightRequestCreateDialog,
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
    authorizedTravel: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      headers: [
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
      isLoading: false,
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
      flightRequest.flightRequestId = null
      flightRequest.tmpId = null

      flightRequest.departLocation = ""
      flightRequest.arriveLocation = ""
      flightRequest.date = ""
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
      if (item.flightRequestId > 0)
        delIndex = this.flightRequests.findIndex(
          (flight) => flight.flightRequestId && flight.flightRequestId == item.flightRequestId
        )
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
      this.isLoading = true

      secureGet(`${TRAVEL_DESK_URL}/flight-request/${this.travelDeskTravelRequestId}`)
        .then((resp) => {
          // console.log(resp.data)
          this.flightRequests.splice(0)
          for (const flightRequest of resp.data) this.flightRequests.push(flightRequest)
          this.isLoading = false
        })
        .catch((e) => {
          console.log(e)
          this.isLoading = false
        })
    },

    async saveFlightRequests() {
      this.isLoading = true
      const body = this.flightRequests

      securePost(`${TRAVEL_DESK_URL}/flight-request/${this.travelDeskTravelRequestId}`, body)
        .then(() => {
          // console.log(resp)
          this.loadFlightRequests()
          this.isLoading = false
        })
        .catch((e) => {
          console.log(e)
          this.isLoading = false
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
