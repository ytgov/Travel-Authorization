<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="originStop.locationId"
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
          v-model="destinationStop.locationId"
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
          v-model="originStop.departureDate"
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
          v-model="originStop.departureTime"
          :rules="[required]"
          label="Time (24h)"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          v-model="originStop.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        />
        <AccommodationTypeSelect
          v-model="originStop.accommodationType"
          :rules="[required]"
          background-color="white"
          dense
          outlined
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="destinationStop.locationId"
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
          v-model="originStop.locationId"
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
          v-model="destinationStop.departureDate"
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
          v-model="destinationStop.departureTime"
          :rules="[required]"
          label="Time (24h)"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          v-model="destinationStop.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        />
        <AccommodationTypeSelect
          v-model="destinationStop.accommodationType"
          :default-value="null"
          background-color="white"
          hint="Optional, set only if neccessary"
          placeholder="N/A"
          clearable
          dense
          outlined
          persistent-hint
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex"
import { isEmpty } from "lodash"

import { required } from "@/utils/validators"

import DatePicker from "@/components/Utils/DatePicker"
import TimePicker from "@/components/Utils/TimePicker"
import AccommodationTypeSelect, {
  ACCOMMODATION_TYPES,
} from "@/modules/travel-authorizations/components/AccommodationTypeSelect"
import TravelMethodSelect, {
  TRAVEL_METHODS,
} from "@/modules/travel-authorizations/components/TravelMethodSelect"

export default {
  name: "RoundTripStopsSection",
  components: {
    AccommodationTypeSelect,
    DatePicker,
    TimePicker,
    TravelMethodSelect,
  },
  data() {
    return {
      originStop: {},
      destinationStop: {},
    }
  },
  computed: {
    ...mapState("travelForm", ["currentForm"]),
    ...mapGetters("travelForm", ["currentFormId", "destinationsByCurrentFormTravelRestriction"]),
  },
  async mounted() {
    await this.loadDestinations()

    if (isEmpty(this.currentForm.stops)) {
      this.currentForm.stops = [this.newStop(), this.newStop({ accommodationType: null })]
    } else if (this.currentForm.stops.length === 1) {
      this.currentForm.stops.push(this.newStop({ accommodationType: null }))
    } else if (this.currentForm.stops.length > 2) {
      const elementsToRemove = this.currentForm.stops.length - 2
      this.currentForm.stops.splice(1, elementsToRemove)
    }

    this.originStop = this.currentForm.stops[0]
    this.destinationStop = this.currentForm.stops[1]
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
    required,
    newStop(attributes) {
      return {
        travelAuthorizationId: this.currentFormId,
        accommodationType: ACCOMMODATION_TYPES.HOTEL,
        transport: TRAVEL_METHODS.AIRCRAFT,
        ...attributes,
      }
    },
  },
}
</script>
