<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          v-model="stop1.locationId"
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
          v-model="stop2.locationId"
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
          v-model="stop1.departureDate"
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
          v-model="stop1.departureTime"
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
          v-model="stop1.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        />
        <AccommodationTypeSelect
          v-model="stop1.accommodationType"
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
          v-model="stop2.locationId"
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
          v-model="stop3.locationId"
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
          v-model="stop2.departureDate"
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
          v-model="stop2.departureTime"
          :rules="[required]"
          label="Time (24 hour)"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          v-model="stop2.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        />
        <AccommodationTypeSelect
          v-model="stop2.accommodationType"
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
          v-model="stop3.locationId"
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
          v-model="stop4.locationId"
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
          v-model="stop3.departureDate"
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
          v-model="stop3.departureTime"
          :rules="[required]"
          label="Time (24 hour)"
          persistent-hint
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <TravelMethodSelect
          v-model="stop3.transport"
          :rules="[required]"
          background-color="white"
          dense
          persistent-hint
          required
          outlined
        />
        <AccommodationTypeSelect
          v-model="stop3.accommodationType"
          :rules="[required]"
          background-color="white"
          dense
          outlined
          required
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
  name: "MultiDestinationStopsSection",
  components: {
    AccommodationTypeSelect,
    DatePicker,
    TimePicker,
    TravelMethodSelect,
  },
  data() {
    return {
      stop1: {},
      stop2: {},
      stop3: {},
      stop4: {},
    }
  },
  computed: {
    ...mapState("travelForm", ["currentTravelAuthorization"]),
    ...mapGetters("travelForm", ["currentTravelAuthorizationId", "destinationsByCurrentFormTravelRestriction"]),
  },
  async mounted() {
    await this.loadDestinations()

    if (isEmpty(this.currentTravelAuthorization.stops)) {
      this.currentTravelAuthorization.stops = [this.newStop(), this.newStop(), this.newStop(), this.newStop()]
    } else if (this.currentTravelAuthorization.stops.length === 1) {
      this.currentTravelAuthorization.stops.splice(0, 0, this.newStop(), this.newStop(), this.newStop())
    } else if (this.currentTravelAuthorization.stops.length === 2) {
      this.currentTravelAuthorization.stops.splice(1, 0, this.newStop(), this.newStop())
    } else if (this.currentTravelAuthorization.stops.length === 3) {
      this.currentTravelAuthorization.stops.splice(2, 0, this.newStop())
    } else if (this.currentTravelAuthorization.stops.length > 4) {
      this.currentTravelAuthorization.stops = this.currentTravelAuthorization.stops.slice(0, 3)
    }

    this.stop1 = this.currentTravelAuthorization.stops[0]
    this.stop2 = this.currentTravelAuthorization.stops[1]
    this.stop3 = this.currentTravelAuthorization.stops[2]
    this.stop4 = this.currentTravelAuthorization.stops[3]
  },
  methods: {
    ...mapActions("travelForm", ["loadDestinations"]),
    required,
    newStop() {
      return {
        travelAuthorizationId: this.currentTravelAuthorizationId,
        accommodationType: ACCOMMODATION_TYPES.HOTEL,
        transport: TRAVEL_METHODS.AIRCRAFT,
      }
    },
  },
}
</script>
