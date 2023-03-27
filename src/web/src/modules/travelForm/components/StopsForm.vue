<template>
  <v-card class="default">
    <v-card-text>
      <stops :review="review" :stops="form.stops" :multiStop="form.multiStop" :oneWayTrip="form.oneWayTrip" />

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
import Stops from "./Stops.vue";

export default {
  name: "Form",
  props: ["form", "review", "continue", "back"],
  components: { Stops },
  data: () => ({}),
  methods: {
    continueClick() {
      this.continue();
    },
    backClick() {
      this.back();
    },
  },
};
</script>
