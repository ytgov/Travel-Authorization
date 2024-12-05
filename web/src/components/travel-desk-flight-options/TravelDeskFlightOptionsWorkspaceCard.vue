<template>
  <v-card>
    <v-card-title>
      <h4>Flight Options Groupings</h4>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="flightOptions"
      :items-per-page="-1"
      :hide-default-footer="true"
      :hide-default-header="true"
    >
      <template #item.name="{ item, index }">
        <v-card
          :class="{
            'mt-5': index !== 0,
          }"
        >
          <v-card-title>
            <h5>Group {{ index + 1 }}</h5>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="3"
              >
                <v-text-field
                  v-model="item.cost"
                  :error="item.state?.costErr"
                  label="Cost"
                  prefix="$"
                  type="number"
                  outlined
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <v-text-field
                  v-model="item.duration"
                  readonly
                  label="Travel Duration"
                  outlined
                />
              </v-col>
              <v-col
                cols="12"
                md="5"
              >
                <v-select
                  v-model="item.flightRequestId"
                  :items="legs"
                  :error="item.state?.legErr"
                  item-value="flightRequestId"
                  label="Leg"
                  outlined
                />
              </v-col>
            </v-row>
            <div
              v-for="(segment, inx) in item.flightSegments"
              :key="'group-' + segment.FlightSegmentID + '-' + inx + flightKey"
            >
              <v-row
                style="cursor: move"
                :draggable="true"
                @dragover.prevent
                @drop.prevent="drop(item, segment, index)"
                @dragstart="drag(segment, index)"
              >
                <v-col
                  cols="12"
                  md="1"
                  align-self="center"
                  class="d-flex justify-center"
                >
                  <v-icon color="primary">mdi-arrow-all</v-icon>
                </v-col>
                <v-col
                  cols="12"
                  md="11"
                >
                  <TravelDeskFlightSegmentCard
                    class="mr-4 mb-2"
                    :travel-desk-flight-segment-id="segment.id"
                  />
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Vue from "vue"

import TravelDeskFlightSegmentCard from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentCard.vue"

export default {
  name: "FlightOptionsTable",
  components: {
    TravelDeskFlightSegmentCard,
  },
  props: {
    readonly: Boolean,
    legs: {
      type: Array,
      required: true,
    },
    flightOptions: {
      type: Array,
      required: true,
    },
    ungroupedFlightSegments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tmpId: 1,
      admin: false,
      savingData: false,
      selectedSegments: [],
      headers: [{ text: "", value: "name", class: "red" }],
      source: {},
      sourceInx: -1,
      flightKey: 0,
    }
  },
  computed: {},
  mounted() {
    this.initForm()
  },
  methods: {
    initForm() {
      // const carRequest = {}
    },
    drag(source, index) {
      this.source = source
      this.sourceInx = index
    },
    drop(flightOption, target, index) {
      if (this.sourceInx != index) return

      const sortOrderTarget = target.sortOrder
      target.sortOrder = JSON.parse(JSON.stringify(this.source.sortOrder))
      this.source.sortOrder = JSON.parse(JSON.stringify(sortOrderTarget))
      Vue.nextTick(() => {
        this.sortByOrder(flightOption.flightSegments)
      })
    },
    sortByOrder(flight) {
      flight.sort((a, b) => {
        return a.sortOrder > b.sortOrder ? 1 : -1
      })
      return flight
    },
  },
}
</script>

<style scoped>
/* ::v-deep tbody tr:nth-of-type(even) {
   background-color: #FFFFFF !important;
 } */

::v-deep table tbody td {
  border: 0px solid white !important;
  background-color: #ffffff !important;
}
</style>
