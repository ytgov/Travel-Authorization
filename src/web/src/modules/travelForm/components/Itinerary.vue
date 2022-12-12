<template>
  <div>
    <v-row>
      <v-col>
        <v-checkbox
          v-model="itinerary.multiStop"
          label="Does this trip involve multipe sdestinations?"
          :disabled="review"
          dense
        >
        </v-checkbox>
        <v-checkbox
          v-model="itinerary.oneWayTrip"
          label="Is this trip one way?"
          :disabled="review"
          dense
        >
        </v-checkbox>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-autocomplete
          v-model="itinerary.stops[0].location"
          dense
          label="Starting Location"
          persistent-hint
          :items="destinations"
          :item-text="destinations.text"
          :item-value="destinations.value"
          required
          clearable
          :disabled="review"
          :rules="requiredRules"
        >
        </v-autocomplete>
      </v-col>
    </v-row>

    <v-row>
      <v-col><DatePicker value="Departure Date" /> </v-col>
      <v-col> <TimePicker value="Departure Time" /></v-col>
      <v-col>
        <v-select
          :items="transport"
          label="Method of transport"
          v-model="itinerary.stops[0].transport"
          dense
          :disabled="review"
          :rules="requiredRules"
        ></v-select
      ></v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-autocomplete
          v-model="itinerary.stops[1].location"
          dense
          label="Destination"
          persistent-hint
          :items="destinations"
          :item-text="destinations.text"
          :item-value="destinations.value"
          required
          clearable
          :disabled="review"
          :rules="requiredRules"
        >
        </v-autocomplete>
      </v-col>
    </v-row>

    <v-row v-if="!itinerary.oneWayTrip === true">
      <v-col><DatePicker value="Departure Date" :review="review" /> </v-col>
      <v-col> <TimePicker value="Departure Time" :review="review" /></v-col>
      <v-col>
        <v-select
          :items="transport"
          label="Method of transport"
          v-model="itinerary.stops[1].transport"
          dense
          :disabled="review"
          :rules="requiredRules"
        ></v-select
      ></v-col>
    </v-row>

    <div v-if="itinerary.multiStop === true">
      <div v-for="(stop, index) in itinerary.stops.slice(2)" :key="index">
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="itinerary.stops[index].location"
              dense
              label="Destination"
              persistent-hint
              :items="destinations"
              :item-text="destinations.text"
              :item-value="destinations.value"
              required
              clearable
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
              :disabled="review"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col><DatePicker value="Departure Date" /> </v-col>
          <v-col> <TimePicker value="Departure Time" /></v-col>
          <v-col>
            <v-select
              :items="transport"
              label="Method of transport"
              v-model="itinerary.stops[index].transport"
              dense
              :disabled="review"
              :rules="requiredRules"
            ></v-select
          ></v-col>
        </v-row>
      </div>
    </div>

    <v-row v-if="!itinerary.oneWayTrip === true">
      <v-col>
        <v-autocomplete
          v-model="itinerary.stops[0].location"
          dense
          label="Final Destination"
          persistent-hint
          :items="destinations"
          :item-text="destinations.text"
          :item-value="destinations.value"
          required
          clearable
          :disabled="review"
          :rules="requiredRules"
        >
        </v-autocomplete>
      </v-col>
    </v-row>

    <v-row v-if="itinerary.multiStop === true">
      <v-col>
        <v-btn color="blue" @click="addStop" :disabled="review">Add Stop</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DatePicker from "@/components/Utils/DatePicker.vue";
import TimePicker from "@/components/Utils/TimePicker.vue";
import axios from "axios";
import { DESTINATION_URL } from "@/urls";

export default {
  name: "Form",
  components: {
    DatePicker,
    TimePicker,
  },
  props: {
    review: {
      type: Boolean,
      default: false,
    },
    itinerary: {
      type: Object,
      default: () => {},
    },
  },
  async mounted() {
    this.destinations = await this.getDestinations();
  },
  data: () => ({
    destinations: [],

    transport: ["Rental vehicle", "Personal vehicle", "Fleet vehicle", "Plane"],
    requiredRules: [(v) => !!v || "This field is required"],
  }),
  methods: {
    addStop() {
      this.itinerary.stops.push({
        location: "",
        departureDate: "",
        departureTime: "12:00",
        transport: "",
      });
      console.log(this.itinerary);
    },
    removeStop(index) {
      this.itinerary.stops.splice(index, 1);
    },
    async getDestinations() {
      return axios.get(`${DESTINATION_URL}`).then((resp) => {
        let destinations = [];
        resp.data.forEach((v) => {
          destinations.push({
            value: v.id,
            text: v.city + " (" + v.province + ")",
          });
        });
        return destinations;
      });
    },
  },
};
</script>


