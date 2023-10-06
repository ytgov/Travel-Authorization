<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="from.locationId"
          :items="destinationsByCurrentFormTravelRestriction"
          :rules="[required]"
          label="From"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="to.locationId"
          :items="destinationsByCurrentFormTravelRestriction"
          :rules="[required]"
          label="To"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <DatePicker
          v-model="from.departureDate"
          :rules="[required]"
          text="Date"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <TimePicker
          v-model="from.departureTime"
          :rules="[required]"
          text="Time"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          v-model="from.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="to.locationId"
          :items="destinationsByCurrentFormTravelRestriction"
          :rules="[required]"
          label="To"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="from.locationId"
          :items="destinationsByCurrentFormTravelRestriction"
          :rules="[required]"
          label="From"
          background-color="white"
          dense
          outlined
          persistent-hint
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <DatePicker
          v-model="to.departureDate"
          :rules="[required]"
          text="Date"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <TimePicker
          v-model="to.departureTime"
          :rules="[required]"
          text="Time"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          v-model="to.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex"
import { isArray, isEmpty } from "lodash"

import { required } from "@/utils/validators"

import DatePicker from "@/components/Utils/DatePicker"
import TimePicker from "@/components/Utils/TimePicker"
import TravelMethodSelect from "@/modules/travelForm/components/TravelMethodSelect"

export default {
  name: "RoundTripStopsSection",
  components: {
    DatePicker,
    TimePicker,
    TravelMethodSelect,
  },
  computed: {
    ...mapState("travelForm", ["currentForm"]),
    ...mapGetters("travelForm", ["currentFormId", "destinationsByCurrentFormTravelRestriction"]),
    from() {
      if (isEmpty(this.currentForm?.stops)) return this.newStop()

      return this.currentForm.stops[0]
    },
    to() {
      if (
        isEmpty(this.currentForm?.stops) ||
        (isArray(this.currentForm?.stops) && this.currentForm.stops.length < 2)
      )
        return this.newStop()

      return this.currentForm.stops[1]
    },
  },
  async mounted() {
    await this.loadDestinations()

    if (isEmpty(this.currentForm.stops)) {
      this.currentForm.stops = [this.newStop(), this.newStop()]
    } else if (this.currentForm.stops.length === 1) {
      this.currentForm.stops.push(this.newStop())
    } else if (this.currentForm.stops.length > 2) {
      const elementsToRemove = this.currentForm.stops.length - 2
      this.currentForm.stops.splice(1, elementsToRemove)
    }
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
    required,
    newStop() {
      return { taid: this.currentFormId }
    },
  },
}
</script>
