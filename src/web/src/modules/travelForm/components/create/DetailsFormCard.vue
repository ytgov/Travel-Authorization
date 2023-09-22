<template>
  <v-card class="default">
    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col>
            <v-checkbox
              :input-value="request.multiStop"
              label="Does this trip involve multiple destinations?"
              dense
              @change="updateMultiStop"
            >
            </v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox
              v-model="request.oneWayTrip"
              label="Is this trip one way?"
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
                :loading="loadingDestinations"
                required
                clearable
                background-color="white"
                outlined
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
                :disabled="index < miminumStops"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><DatePicker
                v-model="stop.departureDate"
                text="Departure Date"
                :rules="requiredRules"
              />
            </v-col>
            <v-col>
              <TimePicker
                v-model="stop.departureTime"
                text="Departure Time"
                :rules="requiredRules"
            /></v-col>
            <v-col>
              <v-select
                :items="transport"
                label="Method of transport"
                v-model="stop.transport"
                dense
                :rules="requiredRules"
              ></v-select
            ></v-col>
          </v-row>
        </div>

        <v-row v-if="request.oneWayTrip !== true && request.stops?.length > 0">
          <v-col>
            <v-autocomplete
              v-model="request.stops[0].locationId"
              dense
              label="Final Destination"
              persistent-hint
              :items="destinations"
              :item-text="destinations.text"
              :item-value="destinations.value"
              :loading="loadingDestinations"
              required
              background-color="white"
              outlined
              clearable
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
              >Add Stop</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex"

import DatePicker from "@/components/Utils/DatePicker"
import TimePicker from "@/components/Utils/TimePicker"

export default {
  name: "StopsFormCreate",
  components: {
    DatePicker,
    TimePicker,
  },
  data: () => ({
    loadingDestinations: false,
    transport: ["Rental vehicle", "Personal vehicle", "Fleet vehicle", "Plane"],
    requiredRules: [(v) => !!v || "This field is required"],
  }),
  computed: {
    ...mapState("travelForm", ["destinations", "request"]),
    miminumStops() {
      if (this.request.multiStop) return 2

      return 1
    },
  },
  async mounted() {
    this.loadingDestinations = true
    await this.loadDestinations().finally(() => {
      this.loadingDestinations = false
    })

    if (this.request.stops.length < 1) {
      this.addStop()
    }

    if (this.request.multiStop && this.request.stops.length < 2) {
      this.addStop()
    }
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
    updateMultiStop(value) {
      if (value && this.request.stops.length < 2) {
        this.addStop()
      }

      this.request.multiStop = value
    },
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
  },
}
</script>
