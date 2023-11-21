<template>
  <v-card class="default">
    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col>
            <v-checkbox
              :input-value="request.multiStop"
              label="Does this trip involve multiple destinations?"
              :disabled="review"
              dense
              @change="updateMultiStop"
            >
            </v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox
              v-model="request.oneWayTrip"
              label="Is this trip one way?"
              :disabled="review"
              dense
            >
            </v-checkbox>
          </v-col>
        </v-row>
        <v-divider class="mb-5"></v-divider>

        <div
          v-for="(stop, index) in request.stops"
          :key="index"
        >
          <v-row>
            <v-col>
              <LocationsAutocomplete
                v-model="stop.locationId"
                dense
                label="Destination"
                persistent-hint
                required
                clearable
                background-color="white"
                outlined
                :disabled="review"
                :rules="requiredRules"
              />
            </v-col>
            <v-col>
              <v-btn
                class="ma-2"
                dense
                small
                color="red"
                :disabled="index < miminumStops || review"
                @click="removeStop(index)"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <DatePicker
                v-model="stop.departureDate"
                label="Departure Date"
                :review="review"
                :rules="requiredRules"
              />
            </v-col>
            <v-col>
              <TimePicker
                v-model="stop.departureTime"
                label="Departure Time"
                :review="review"
                :rules="requiredRules"
              />
            </v-col>
            <v-col>
              <v-select
                v-model="stop.transport"
                :items="transport"
                label="Method of transport"
                dense
                :disabled="review"
                :rules="requiredRules"
              ></v-select
            ></v-col>
          </v-row>
        </div>

        <v-row v-if="request.oneWayTrip !== true && request.stops.length > 0">
          <v-col>
            <LocationsAutocomplete
              v-model="request.stops[0].locationId"
              dense
              label="Final Destination"
              persistent-hint
              required
              background-color="white"
              outlined
              clearable
              :disabled="review"
              :rules="requiredRules"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn
              color="blue"
              :disabled="review"
              @click="addStop"
              >Add Stop</v-btn
            >
          </v-col>
        </v-row>
      </v-form>

      <v-row>
        <v-col class="mr-auto pb-0">
          <v-btn
            color="secondary"
            @click="backClick"
          >
            Back
          </v-btn>
        </v-col>

        <v-col class="col-auto pb-0">
          <v-btn
            color="primary"
            @click="continueClick"
          >
            Continue
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex"

import DatePicker from "@/components/Utils/DatePicker"
import LocationsAutocomplete from "@/components/LocationsAutocomplete"
import TimePicker from "@/components/Utils/TimePicker"

export default {
  name: "StopsFormManage",
  components: {
    DatePicker,
    LocationsAutocomplete,
    TimePicker,
  },
  props: {
    continue: {
      type: Function,
      required: true,
    },
    back: {
      type: Function,
      required: true,
    },
    formId: {
      type: Number,
      default: -1,
    },
    review: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    transport: ["Rental vehicle", "Personal vehicle", "Fleet vehicle", "Plane"],
    requiredRules: [(v) => !!v || "This field is required"],
  }),
  computed: {
    ...mapState("travelAuthorizations", ["request"]),
    miminumStops() {
      if (this.request.multiStop) return 2

      return 1
    },
  },
  async mounted() {
    if (this.request.stops.length < 1) {
      this.addStop()
    }

    if (this.request.multiStop && this.request.stops.length < 2) {
      this.addStop()
    }
  },
  methods: {
    updateMultiStop(value) {
      if (value && this.request.stops.length < 2) {
        this.addStop()
      }

      this.request.multiStop = value
    },
    addStop() {
      this.request.stops.push({
        travelAuthorizationId: this.formId,
        locationId: "",
        departureDate: "",
        departureTime: "12:00",
        transport: "",
      })
    },
    removeStop(index) {
      this.request.stops.splice(index, 1)
    },
    continueClick() {
      let formValid = this.$refs.form.validate()
      if (formValid) this.continue()
    },
    backClick() {
      this.back()
    },
  },
}
</script>
