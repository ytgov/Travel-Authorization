<template>
  <div>
    <v-dialog
      v-model="hotelDialog"
      persistent
      max-width="80%"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          :class="type == 'Add New' ? 'my-4 right' : 'mx-0 px-0'"
          :color="type == 'Add New' ? 'primary' : 'transparent'"
          style="min-width: 0"
          v-bind="attrs"
          @click="initForm"
          v-on="on"
        >
          <div v-if="type == 'Add New'">Add Hotel</div>
          <v-icon
            v-else
            class="mx-0 px-0"
            color="blue"
            >mdi-pencil</v-icon
          >
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="blue">
          <div class="text-h5">Add Hotel</div>
        </v-card-title>

        <v-card-text>
          <v-row class="mt-5 mx-3">
            <v-col cols="4">
              <v-text-field
                v-model="hotelRequest.checkIn"
                :error="state.checkInErr"
                label="Check-in Date"
                outlined
                :min="minDate"
                :max="maxDate"
                type="date"
                @input="state.checkInErr = false"
              />
              <v-text-field
                v-model="hotelRequest.checkOut"
                :error="state.checkOutErr"
                label="Check-out Date"
                outlined
                :min="minDate"
                :max="maxDate"
                type="date"
                @input="state.checkOutErr = false"
              />
              <v-autocomplete
                v-model="hotelRequest.city"
                :items="destinations"
                item-value="text"
                :error="state.cityErr"
                label="City"
                outlined
                @input="state.cityErr = false"
              />
              <v-radio-group
                v-model="hotelRequest.isDedicatedConferenceHotelAvailable"
                :error="state.isDedicatedConferenceHotelAvailableErr"
                label="Conference/Meeting Hotel?"
                outlined
                row
              >
                <v-radio
                  label="Yes"
                  :value="true"
                ></v-radio>
                <v-radio
                  label="No"
                  :value="false"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="8">
              <v-textarea
                v-model="hotelRequest.additionalInformation"
                :error="state.additionalInfoErr"
                label="Additional Information"
                rows="8"
                outlined
                :clearable="!readonly"
              />
            </v-col>
          </v-row>

          <v-row class="mt-0 mx-3">
            <v-col cols="4">
              <v-text-field
                v-model="hotelRequest.conferenceName"
                :error="state.conferenceNameErr"
                label="Conference/Meeting Name"
                outlined
                @input="state.conferenceNameErr = false"
              />
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="hotelRequest.conferenceHotelName"
                :error="state.conferenceHotelNameErr"
                label="Conference/Meeting Hotel"
                outlined
                @input="state.conferenceHotelNameErr = false"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="grey darken-5"
            @click="hotelDialog = false"
          >
            <div v-if="type == 'View'">Close</div>
            <div v-else>Cancel</div>
          </v-btn>
          <v-btn
            class="ml-auto"
            color="green darken-1"
            @click="saveHotelRequest"
          >
            <div v-if="type == 'View'">Save</div>
            <div v-else>Add</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue"

export default {
  name: "TravelDeskHotelCreateDialog",
  props: {
    type: {
      type: String,
      required: true,
    },
    hotelRequest: {
      type: Object,
      default: () => ({}),
    },
    flightRequests: {
      type: Array,
      default: () => [],
    },
    minDate: {
      type: String,
      default: "",
    },
    maxDate: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      checkIn: "",
      checkOut: "",
      hotelDialog: false,
      readonly: false,

      state: {
        checkInErr: false,
        checkOutErr: false,
        cityErr: false,
        isDedicatedConferenceHotelAvailableErr: false,
        conferenceNameErr: false,
        conferenceHotelNameErr: false,
        additionalInfoErr: false,
      },
      destinations: [],
    }
  },
  mounted() {
    this.destinations = this.$store.state.traveldesk.destinations
  },
  methods: {
    checkFields() {
      this.state.checkInErr = this.hotelRequest.checkIn ? false : true
      this.state.checkOutErr = this.hotelRequest.checkOut ? false : true
      this.state.cityErr = this.hotelRequest.city ? false : true
      this.state.isDedicatedConferenceHotelAvailableErr =
        this.hotelRequest.isDedicatedConferenceHotelAvailable != null ? false : true
      this.state.conferenceNameErr = this.hotelRequest.conferenceName ? false : true
      this.state.conferenceHotelNameErr = this.hotelRequest.conferenceHotelName ? false : true
      this.state.additionalInfoErr = false

      for (const key of Object.keys(this.state)) {
        if (this.state[key]) return false
      }
      return true
    },

    saveHotelRequest() {
      if (this.checkFields()) {
        this.$emit("updateTable", this.type)
        this.hotelDialog = false
      }
    },

    initForm() {
      this.initStates()
      const flightDates = Vue.filter("flightStartEnd")(this.flightRequests)

      if (this.type == "Add New") {
        this.hotelRequest.checkIn = flightDates.start
        this.hotelRequest.checkOut = flightDates.end
        this.hotelRequest.city = ""
        this.hotelRequest.isDedicatedConferenceHotelAvailable = true
        this.hotelRequest.conferenceName = ""
        this.hotelRequest.conferenceHotelName = ""
        this.hotelRequest.additionalInformation = ""
      }
    },

    initStates() {
      for (const key of Object.keys(this.state)) {
        this.state[key] = false
      }
    },
  },
}
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
