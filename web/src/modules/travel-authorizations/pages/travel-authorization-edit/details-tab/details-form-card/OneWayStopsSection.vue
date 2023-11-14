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
          label="Date"
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
          :default-value="null"
          hint="Optional, set only if neccessary"
          placeholder="N/A"
          background-color="white"
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
import AccommodationTypeSelect from "@/modules/travel-authorizations/components/AccommodationTypeSelect"
import TravelMethodSelect, {
  TRAVEL_METHODS,
} from "@/modules/travel-authorizations/components/TravelMethodSelect"

export default {
  name: "OneWayStopsSection",
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
    ...mapState("travelAuthorizations", ["currentTravelAuthorization"]),
    ...mapGetters("travelAuthorizations", [
      "currentTravelAuthorizationId",
      "destinationsByCurrentFormTravelRestriction",
    ]),
  },
  async mounted() {
    await this.loadDestinations()

    if (isEmpty(this.currentTravelAuthorization.stops)) {
      this.currentTravelAuthorization.stops = [this.newStop(), this.newStop({ transport: null })]
    } else if (this.currentTravelAuthorization.stops.length === 1) {
      this.currentTravelAuthorization.stops.push(this.newStop({ transport: null }))
    } else if (this.currentTravelAuthorization.stops.length > 2) {
      const elementsToRemove = this.currentTravelAuthorization.stops.length - 2
      this.currentTravelAuthorization.stops.splice(1, elementsToRemove)
    }

    this.originStop = this.currentTravelAuthorization.stops[0]
    this.destinationStop = this.currentTravelAuthorization.stops[1]
  },
  methods: {
    ...mapActions("travelAuthorizations", ["loadDestinations"]),
    required,
    newStop(attributes) {
      return {
        travelAuthorizationId: this.currentTravelAuthorizationId,
        accommodationType: null,
        transport: TRAVEL_METHODS.AIRCRAFT,
        ...attributes,
      }
    },
  },
}
</script>
