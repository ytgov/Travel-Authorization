<template>
  <div>
    <title-card
      class="mt-5"
      titleWidth="3.5rem"
    >
      <template #title>
        <div>Flight</div>
      </template>
      <template #body>
        <v-row class="mt-2 mx-0">
          <div style="width: 1.5%" />
          <div style="width: 29%">
            <v-text-field
              size="sm"
              :error="flightSegment.state.flightErr"
              @input="flightSegment.state.flightErr = false"
              label="Flight"
              v-model="flightSegment.flightNumber"
              outlined
            />
          </div>
          <div style="width: 0.5%" />
          <div style="width: 15%">
            <v-text-field
              :error="flightSegment.state.departAtErr"
              @input="
                changeDate()
                flightSegment.state.departAtErr = false
              "
              label="Departure Date"
              v-model="flightSegment.departDay"
              outlined
              density="compact"
              type="date"
            />
          </div>
          <div style="width: 0.2%" />
          <div style="width: 10%">
            <v-text-field
              :error="flightSegment.state.departTimeErr"
              @input="
                changeDate()
                flightSegment.state.departTimeErr = false
              "
              label="Departure Time"
              v-model="flightSegment.departTime"
              outlined
              type="time"
            />
          </div>
          <div style="width: 0.5%" />
          <div style="width: 42%">
            <v-text-field
              :error="flightSegment.state.departLocationErr"
              @input="flightSegment.state.departLocationErr = false"
              label="Depart From"
              v-model="flightSegment.departLocation"
              outlined
            />
          </div>
          <div style="width: 0.5%" />
        </v-row>

        <v-row class="mt-n5 mx-0">
          <div style="width: 1.5%" />
          <div style="width: 15%">
            <v-text-field
              :error="flightSegment.state.durationErr"
              @input="flightSegment.state.durationErr = false"
              label="Duration"
              v-model="flightSegment.duration"
              outlined
            />
          </div>
          <div style="width: 0.5%" />
          <div style="width: 15%">
            <v-text-field
              :error="flightSegment.state.arriveAtErr"
              @input="
                changeDate()
                flightSegment.state.arriveAtErr = false
              "
              label="Arrival Date"
              v-model="flightSegment.arriveDay"
              outlined
              type="date"
            />
          </div>
          <div style="width: 0.2%" />
          <div style="width: 10%">
            <v-text-field
              :error="flightSegment.state.arriveTimeErr"
              @input="
                changeDate()
                flightSegment.state.arriveTimeErr = false
              "
              label="Arrival Time"
              v-model="flightSegment.arriveTime"
              outlined
              type="time"
            />
          </div>
          <div style="width: 0.5%" />
          <div style="width: 42%">
            <v-text-field
              :error="flightSegment.state.arriveLocationErr"
              @input="flightSegment.state.arriveLocationErr = false"
              label="Arrive To"
              v-model="flightSegment.arriveLocation"
              outlined
            />
          </div>
          <div style="width: 0.5%" />
          <div style="width: 7%">
            <v-text-field
              :error="flightSegment.state.statusErr"
              @input="flightSegment.state.statusErr = false"
              label="Status"
              v-model="flightSegment.status"
              outlined
            />
          </div>
          <div style="width: 0.5%" />
          <div style="width: 6%">
            <v-text-field
              :error="flightSegment.state.classErr"
              @input="flightSegment.state.classErr = false"
              label="Class"
              v-model="flightSegment.class"
              outlined
            />
          </div>
          <div style="width: 0.5%" />
        </v-row>
      </template>
    </title-card>
  </div>
</template>

<script>
// import Vue from "vue";
import TitleCard from "../../Common/TitleCard.vue"

export default {
  name: "FlightSegment",
  components: {
    TitleCard,
  },
  props: {
    flightSegment: {},
  },
  data() {
    return {
      // travelPortDialog: false,
      // readonly: false,
      // portText:"",
    }
  },
  mounted() {},
  methods: {
    initForm() {
      //
    },
    changeDate() {
      if (this.flightSegment.departDay && this.flightSegment.departTime) {
        this.flightSegment.departAt =
          this.flightSegment.departDay + "T" + this.flightSegment.departTime + ":00.000Z"
      }
      if (this.flightSegment.arriveDay && this.flightSegment.arriveTime) {
        this.flightSegment.arriveAt =
          this.flightSegment.arriveDay + "T" + this.flightSegment.arriveTime + ":00.000Z"
      }
    },
  },
}
</script>

<style scoped>
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
