<template>
  <div>
    <v-dialog
      v-model="flightDialog"
      persistent
      max-width="80%"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          :disabled="disabled"
          :class="type == 'Add New' ? 'my-4 right' : 'mx-0 px-0'"
          :color="type == 'Add New' ? 'primary' : 'transparent'"
          style="min-width: 0"
          v-bind="attrs"
          @click="initForm"
          v-on="on"
        >
          <div v-if="type == 'Add New'">Add Flight</div>
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
          <div class="text-h5">Add Flight</div>
        </v-card-title>

        <v-card-text>
          <!-- <ROW-1> -->
          <v-row class="mt-5 mx-0">
            <v-col cols="4">
              <v-autocomplete
                v-model="flightRequest.departLocation"
                :items="destinations"
                item-value="text"
                :error="state.departLocationErr"
                label="Depart Location"
                outlined
                @input="state.departLocationErr = false"
              />
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                v-model="flightRequest.arriveLocation"
                :items="destinations"
                item-value="text"
                :error="state.arriveLocationErr"
                label="Arrive Location"
                outlined
                @input="state.arriveLocationErr = false"
              />
            </v-col>
          </v-row>
          <!-- <ROW-2> -->
          <v-row class="mt-0 mx-0">
            <v-col cols="4">
              <v-text-field
                v-model="date"
                :readonly="readonly"
                :error="state.datePreferenceErr"
                :min="minDate"
                :max="maxDate"
                label="Date"
                outlined
                type="date"
                @input="state.datePreferenceErr = false"
              />
            </v-col>
            <v-col cols="4">
              <div class="label">Time Preference</div>
              <v-radio-group
                v-model="flightRequest.timePreference"
                :error="state.timePreferenceErr"
                class="mt-1"
                row
              >
                <v-radio
                  label="AM"
                  value="AM"
                ></v-radio>
                <v-radio
                  label="PM"
                  value="PM"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="flightRequest.seatPreference"
                :items="seatPreferenceList"
                :error="state.seatPreferenceErr"
                label="Seat Preference"
                outlined
                @input="state.seatPreferenceErr = false"
              />
              <!-- <div class="label"></div>
              <v-radio-group
                :error=""
                class="mt-1"
                v-model=""
                row>
                <v-radio label="Aisle" value="Aisle"></v-radio>
                <v-radio label="Middle" value="Middle"></v-radio>
                <v-radio label="Window" value="Window"></v-radio>
                <v-radio label="Aisle" value="Aisle"></v-radio>
              </v-radio-group>	 -->
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="grey darken-5"
            @click="flightDialog = false"
          >
            <div v-if="type == 'View'">Close</div>
            <div v-else>Cancel</div>
          </v-btn>
          <v-btn
            class="ml-auto"
            color="green darken-1"
            @click="saveFlightRequest"
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
export default {
  name: "NewFlightRequest",
  props: {
    type: {
      type: String,
      required: true,
    },
    flightRequest: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      date: "",
      flightDialog: false,
      readonly: false,
      seatPreferenceList: ["Aisle", "Middle", "Window", "No Preference"],

      state: {
        departLocationErr: false,
        arriveLocationErr: false,
        dateErr: false,
        timePreferenceErr: false,
        seatPreferenceErr: false,
      },
      destinations: [],
    }
  },
  mounted() {
    this.destinations = this.$store.state.traveldesk.destinations
  },
  methods: {
    checkFields() {
      this.state.departLocationErr = this.flightRequest.departLocation ? false : true
      this.state.arriveLocationErr = this.flightRequest.arriveLocation ? false : true

      this.state.datePreferenceErr = this.datePreference ? false : true
      this.state.timePreferenceErr = this.flightRequest.timePreference ? false : true
      this.state.seatPreferenceErr = this.flightRequest.seatPreference ? false : true

      for (const key of Object.keys(this.state)) {
        if (this.state[key]) return false
      }
      return true
    },

    saveFlightRequest() {
      if (this.checkFields()) {
        this.flightRequest.datePreference = this.datePreference
        this.$emit("updateTable", this.type)
        this.flightDialog = false
      }
    },

    initForm() {
      this.initStates()

      if (this.type == "Add New") {
        this.flightRequest.departLocation = ""
        this.flightRequest.arriveLocation = ""

        this.flightRequest.datePreference = ""
        this.flightRequest.timePreference = ""
        this.flightRequest.seatPreference = ""
        this.flightRequest.flightOptions = []
        // this.flightRequest.status="Requested"//, Reserved"

        this.datePreference = ""
      } else {
        this.datePreference = this.flightRequest.datePreference
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
