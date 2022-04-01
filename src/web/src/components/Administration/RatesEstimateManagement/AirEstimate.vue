<template>
  <v-app>
    <v-container fluid>
      <H1>Flight Estimates</H1>
      <Breadcrumbs />
      <v-card> </v-card>
      <v-row v-for="(flightEstimate, index) in flightEstimates" :key="index">
        <v-col cols="3">
          <v-text-field v-model="flightEstimate.flight"> </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="flightEstimate.estimate"> </v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn
            class="ma-2"
            dense
            small
            color="red"
            @click="removeStop(index)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-btn class="ma-2" dense small color="green"> Save </v-btn>
      <v-btn class="ma-2" dense small color="red"> Dsicard Changes </v-btn>
    </v-container>
  </v-app>
</template>
<script>
import Breadcrumbs from "../../Breadcrumbs.vue";
export default {
  name: "flightEstimates",
  components: {
    Breadcrumbs,
  },
  data: () => ({
    flightEstimates: [{ flight: "Whitehorse to Vancouver", estimate: "780" }],
  }),
};
</script>


