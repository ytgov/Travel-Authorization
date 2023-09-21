<template>
  <v-card class="default">
    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col>
            <v-checkbox
              v-model="request.multiStop"
              label="Does this trip involve multiple destinations?"
              :disabled="review"
              dense
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
              <v-autocomplete
                v-model="stop.locationId"
                dense
                label="Destination"
                persistent-hint
                :items="destinations"
                :item-text="destinations.text"
                :item-value="destinations.value"
                required
                clearable
                background-color="white"
                outlined
                :disabled="review"
                :rules="requiredRules"
              >
              </v-autocomplete>
            </v-col>
            <v-col>
              <v-btn
                class="ma-2"
                dense
                small
                color="red"
                @click="removeStop(index)"
                :disabled="review || index === 0"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><DatePicker
                :value="stop.departureDate"
                text="Departure Date"
                :review="review"
              />
            </v-col>
            <v-col>
              <TimePicker
                :value="stop.departureTime"
                text="Departure Time"
                :review="review"
            /></v-col>
            <v-col>
              <v-select
                :items="transport"
                label="Method of transport"
                v-model="stop.transport"
                dense
                :disabled="review"
                :rules="requiredRules"
              ></v-select
            ></v-col>
          </v-row>
        </div>

        <v-row v-if="request.oneWayTrip !== true">
          <v-col>
            <v-autocomplete
              v-model="request.stops[0].locationId"
              dense
              label="Final Destination"
              persistent-hint
              :items="destinations"
              :item-text="destinations.text"
              :item-value="destinations.value"
              required
              background-color="white"
              outlined
              clearable
              :disabled="review"
              :rules="requiredRules"
            >
            </v-autocomplete>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn
              color="blue"
              @click="addStop"
              :disabled="review"
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
import { mapState, mapActions } from "vuex"

import DatePicker from "@/components/Utils/DatePicker"
import TimePicker from "@/components/Utils/TimePicker"

export default {
  name: "StopsForm",
  components: {
    DatePicker,
    TimePicker,
  },
  props: ["review", "continue", "back"],
  data: () => ({
    transport: ["Rental vehicle", "Personal vehicle", "Fleet vehicle", "Plane"],
    requiredRules: [(v) => !!v || "This field is required"],
  }),
  computed: {
    ...mapState("travelForm", ["destinations", "request"]),
  },
  async mounted() {
    await this.loadDestinations()

    if (this.request.stops.length < 1) {
      this.addStop()
    }

    if (this.request.multiStop && this.request.stops.length < 2) {
      this.addStop()
    }
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
    addStop() {
      this.request.stops.push({
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
