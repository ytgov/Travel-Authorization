<template>
  <v-card class="default">
    <v-card-text>
      <div>
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
            <v-checkbox v-model="request.oneWayTrip" label="Is this trip one way?" :disabled="review" dense>
            </v-checkbox>
          </v-col>
        </v-row>
        <v-divider class="mb-5"></v-divider>

        <v-row>
          <v-col>
            <v-autocomplete
              v-model="request.stops[0].locationId"
              dense
              label="Starting Location"
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
          <v-col><DatePicker value="Departure Date" background-color="white" outlined /> </v-col>
          <v-col> <TimePicker value="Departure Time"/></v-col>
          <v-col>
            <v-select
              :items="transport"
              label="Method of transport"
              v-model="request.stops[0].transport"
              dense
              background-color="white"
              outlined
              :disabled="review"
              :rules="requiredRules"
            ></v-select
          ></v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-autocomplete
              v-model="request.stops[1].locationId"
              dense
              label="Destination"
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

        <v-row v-if="request.oneWayTrip === false">
          <v-col><DatePicker :value="request.stops[1].departureDate" text="Departure Date" :review="review" /> </v-col>
          <v-col> <TimePicker :value="request.stops[1].departureTime" text="Departure Time" :review="review"/></v-col>
          <v-col>
            <v-select
              :items="transport"
              label="Method of transport"
              v-model="request.stops[1].transport"
              dense
              :disabled="review"
              background-color="white"
              outlined
              :rules="requiredRules"
            ></v-select
          ></v-col>
        </v-row>

        <div v-if="request.multiStop === true">
          <div v-for="(stop, index) in request.stops.slice(2)" :key="index">
            <v-row>
              <v-col>
                <v-autocomplete
                  v-model="request.stops[index].locationId"
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
                <v-btn class="ma-2" dense small color="red" @click="removeStop(index)" :disabled="review">
                  <v-icon>mdi-trash-can</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                ><DatePicker :value="request.stops[1].departureDate" text="Departure Date" :review="review" />
              </v-col>
              <v-col>
                <TimePicker :value="request.stops[1].departureTime" text="Departure Time" :review="review"
              /></v-col>
              <v-col>
                <v-select
                  :items="transport"
                  label="Method of transport"
                  v-model="request.stops[index].transport"
                  dense
                  :disabled="review"
                  :rules="requiredRules"
                ></v-select
              ></v-col>
            </v-row>
          </div>
        </div>

        <v-row v-if="request.oneWayTrip === false">
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

        <v-row v-if="request.multiStop === true">
          <v-col>
            <v-btn color="blue" @click="addStop" :disabled="review">Add Stop</v-btn>
          </v-col>
        </v-row>
      </div>

      <v-row>
        <v-col class="mr-auto pb-0">
          <v-btn color="secondary" @click="backClick">
            Back
          </v-btn>
        </v-col>

        <v-col class="col-auto pb-0">
          <v-btn color="primary" @click="continueClick">
            Continue
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import DatePicker from "@/components/Utils/DatePicker.vue";
import TimePicker from "@/components/Utils/TimePicker.vue";
import { mapState } from "vuex";

export default {
  name: "StopsForm",
  components: {
    DatePicker,
    TimePicker,
  },
  props: ["review", "continue", "back"],

  async mounted() {},
  data: () => ({
    transport: ["Rental vehicle", "Personal vehicle", "Fleet vehicle", "Plane"],
    requiredRules: [(v) => !!v || "This field is required"],
  }),
  computed: {
    ...mapState("travelForm", ["destinations", "request"]),
  },
  methods: {
    addStop() {
      this.request.stops.push({
        locationId: "",
        departureDate: "",
        departureTime: "12:00",
        transport: "",
      });
    },
    removeStop(index) {
      this.request.stops.splice(index, 1);
    },
    continueClick() {
      let formValid = this.$refs.form.validate();
      if (formValid) this.continue();
    },
    backClick() {
      this.back();
    },
  },
};
</script>
