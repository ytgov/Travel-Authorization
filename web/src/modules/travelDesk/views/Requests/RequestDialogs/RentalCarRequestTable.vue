<template>
  <div>
    <TitleCard
      class="mt-10 mx-5"
      title-width="11rem"
    >
      <template #title>
        <div>Rental Car Request</div>
      </template>
      <template #body>
        <v-row class="mt-3 mx-3">
          <NewRentalCarRequest
            v-if="!readonly"
            class="ml-auto mr-3"
            type="Add New"
            :min-date="minDate"
            :max-date="maxDate"
            :flight-requests="flightRequests"
            :car-request="carRequest"
            @updateTable="updateTable"
          />
        </v-row>
        <v-row class="mb-3 mx-3">
          <v-col
            v-if="rentalCars?.length > 0"
            cols="12"
          >
            <v-data-table
              :headers="rentalCarHeaders"
              :items="rentalCars"
              hide-default-footer
              class="elevation-1"
            >
              <template #item.matchFlightTimes="{ item }">
                {{ item.matchFlightTimes ? "Yes" : "No" }}
              </template>
              <template #item.pickUpLocation="{ item }">
                <div v-if="item.pickUpLocation == 'Other'">{{ item.pickUpLocationOther }}</div>
                <div v-else>{{ item.pickUpLocation }}</div>
              </template>

              <template #item.dropOffLocation="{ item }">
                <div v-if="item.sameDropOffLocation && item.pickUpLocation == 'Other'">
                  {{ item.pickUpLocationOther }}
                </div>
                <div v-else-if="item.sameDropOffLocation">{{ item.pickUpLocation }}</div>
                <div v-else>{{ item.dropOffLocation }}</div>
              </template>

              <template #item.pickUpDate="{ item }">
                {{ item.pickUpDate | beautifyDateTime }}
              </template>
              <template #item.dropOffDate="{ item }">
                {{ item.dropOffDate | beautifyDateTime }}
              </template>

              <template #item.edit="{ item }">
                <v-row class="m-0 p-0">
                  <NewRentalCarRequest
                    v-if="!readonly"
                    type="Edit"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :flight-requests="flightRequests"
                    :car-request="item"
                    @updateTable="updateTable"
                  />
                  <v-btn
                    v-if="!readonly"
                    style="min-width: 0"
                    color="transparent"
                    class="px-1 pt-2"
                    small
                    @click="removeRentalCar(item)"
                    ><v-icon
                      class=""
                      color="red"
                      >mdi-close</v-icon
                    >
                  </v-btn>
                </v-row>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </template>
    </TitleCard>
  </div>
</template>

<script>
import { cloneDeep } from "lodash"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"
import NewRentalCarRequest from "@/modules/travelDesk/views/Requests/RequestDialogs/NewRentalCarRequest.vue"

export default {
  name: "RentalCarRequestTable",
  components: {
    TitleCard,
    NewRentalCarRequest,
  },
  props: {
    readonly: Boolean,
    rentalCars: {
      type: Array,
      required: true,
    },
    flightRequests: {
      type: Array,
      required: true,
    },
    authorizedTravel: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      rentalCarHeaders: [
        {
          text: "Match Flight Times",
          value: "matchFlightTimes",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        {
          text: "Pick-Up City",
          value: "pickUpCity",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        {
          text: "Pick-up Location",
          value: "pickUpLocation",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        {
          text: "Drop-off City",
          value: "dropOffCity",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        {
          text: "Drop-off Location",
          value: "dropOffLocation",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        { text: "Pick-up Date", value: "pickUpDate", class: "blue-grey lighten-4" },
        { text: "Drop-off Date", value: "dropOffDate", class: "blue-grey lighten-4" },

        {
          text: "Vehicle Type",
          value: "vehicleType",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        {
          text: "Reason Change",
          value: "vehicleChangeRationale",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        {
          text: "Additional Notes",
          value: "additionalNotes",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        { text: "", value: "edit", class: "blue-grey lighten-4", width: "4rem", sortable: false },
      ],
      carRequest: {},
      tmpId: 1,
      admin: false,
      travelerDetails: {},
      savingData: false,
      minDate: "",
      maxDate: "",
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    updateTable(type) {
      if (type == "Add New") {
        this.carRequest.tmpId = this.tmpId
        this.rentalCars.push(cloneDeep(this.carRequest))
        this.tmpId++
      }
    },

    initForm() {
      if (this.authorizedTravel?.startDate && this.authorizedTravel?.endDate) {
        this.minDate = this.authorizedTravel.startDate.slice(0, 10)
        this.maxDate = this.authorizedTravel.endDate.slice(0, 10)
      }

      const carRequest = {}
      carRequest.id = null
      carRequest.tmpId = null
      carRequest.pickUpCity = ""
      carRequest.dropOffCity = ""
      carRequest.pickUpLocation = ""
      carRequest.pickUpLocationOther = ""
      carRequest.dropOffLocation = ""
      carRequest.dropOffLocationOther = ""
      carRequest.sameDropOffLocation = true
      carRequest.matchFlightTimes = false
      carRequest.pickUpDate = ""
      carRequest.dropOffDate = ""
      carRequest.vehicleType = "Compact"
      carRequest.vehicleChangeRationale = ""
      carRequest.additionalNotes = ""
      carRequest.status = "Requested"

      this.carRequest = carRequest
    },

    editRentalCar(item) {
      this.carRequest = item
    },

    removeRentalCar(item) {
      console.log(item)
      let delIndex = -1
      if (item.id > 0)
        delIndex = this.rentalCars.findIndex((rentalCar) => rentalCar.id && rentalCar.id == item.id)
      else
        delIndex = this.rentalCars.findIndex(
          (rentalCar) => rentalCar.tmpId && rentalCar.tmpId == item.tmpId
        )
      console.log(delIndex)
      if (delIndex >= 0) {
        this.rentalCars.splice(delIndex, 1)
      }
    },
  },
}
</script>

<style scoped></style>
