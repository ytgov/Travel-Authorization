<template>
  <div>
    <v-row>
      <v-col>
        <v-checkbox v-model="multiStop" label="Does this trip involve multipe sdestinations?" :disabled="review" dense>
        </v-checkbox>
        <v-checkbox v-model="oneWayTrip" label="Is this trip one way?" :disabled="review" dense> </v-checkbox>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-autocomplete
          v-model="stops[0].locationId"
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
      <v-col> <TimePicker value="Departure Time"/></v-col>
      <v-col>
        <v-select
          :items="transport"
          label="Method of transport"
          v-model="stops[0].transport"
          dense
          :disabled="review"
          :rules="requiredRules"
        ></v-select
      ></v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-autocomplete
          v-model="stops[1].locationId"
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

    <v-row v-if="!oneWayTrip === true">
      <v-col><DatePicker :value="stops[1].departureDate" text="Departure Date" :review="review" /> </v-col>
      <v-col> <TimePicker :value="stops[1].departureTime" text="Departure Time" :review="review"/></v-col>
      <v-col>
        <v-select
          :items="transport"
          label="Method of transport"
          v-model="stops[1].transport"
          dense
          :disabled="review"
          :rules="requiredRules"
        ></v-select
      ></v-col>
    </v-row>

    <div v-if="multiStop === true">
      <div v-for="(stop, index) in stops.stops.slice(2)" :key="index">
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="stops[index].locationId"
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
            <v-btn class="ma-2" dense small color="red" @click="removeStop(index)" :disabled="review">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col><DatePicker :value="stops[1].departureDate" text="Departure Date" :review="review" /> </v-col>
          <v-col> <TimePicker :value="stops[1].departureTime" text="Departure Time" :review="review"/></v-col>
          <v-col>
            <v-select
              :items="transport"
              label="Method of transport"
              v-model="stops[index].transport"
              dense
              :disabled="review"
              :rules="requiredRules"
            ></v-select
          ></v-col>
        </v-row>
      </div>
    </div>

    <v-row v-if="!oneWayTrip === true">
      <v-col>
        <v-autocomplete
          v-model="stops[0].locationId"
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

    <v-row v-if="multiStop === true">
      <v-col>
        <v-btn color="blue" @click="addStop" :disabled="review">Add Stop</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DatePicker from "@/components/Utils/DatePicker.vue";
import TimePicker from "@/components/Utils/TimePicker.vue";
import { secureGet } from "../../../store/jwt";
import { DESTINATION_URL } from "@/urls";

export default {
  name: "Form",
  components: {
    DatePicker,
    TimePicker
  },
  props: {
    review: {
      type: Boolean,
      default: false
    },
    oneWayTrip: {
      type: Boolean,
      default: false
    },
    multiStop: {
      type: Boolean,
      default: false
    },
    stops: {
      type: Array,
      default: () => [
        {
          locationId: "",
          departureDate: "",
          departureTime: "12:00",
          transport: ""
        },
        {
          locationId: "",
          departureDate: "",
          departureTime: "12:00",
          transport: ""
        }
      ]
    }
  },
  async mounted() {
    this.destinations = await this.getDestinations();
  },
  data: () => ({
    destinations: [],

    transport: ["Rental vehicle", "Personal vehicle", "Fleet vehicle", "Plane"],
    requiredRules: [v => !!v || "This field is required"]
  }),
  methods: {
    addStop() {
      this.stops.push({
        locationId: "",
        departureDate: "",
        departureTime: "12:00",
        transport: ""
      });
    },
    removeStop(index) {
      this.stops.splice(index, 1);
    },
    async getDestinations() {
      return secureGet(`${DESTINATION_URL}`).then(resp => {
        let destinations = [];
        resp.data.forEach(v => {
          destinations.push({
            value: v.id,
            text: v.city + " (" + v.province + ")"
          });
        });
        return destinations;
      });
    }
  }
};
</script>
