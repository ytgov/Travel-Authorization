<template>
  <v-card
    elevation="2"
    class="default"
  >
    <v-card-title> Purpose </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-row dense>
              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="currentForm.purposeId"
                  :items="purposes"
                  :loading="loadingPurposes"
                  :rules="[required]"
                  background-color="white"
                  dense
                  item-text="purpose"
                  item-value="id"
                  label="Purpose"
                  outlined
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="currentForm.eventName"
                  :rules="[required]"
                  background-color="white"
                  dense
                  label="Name of meeting/conference, mission, trade fair or course"
                  outlined
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-autocomplete
                  v-model="finalDestination.locationId"
                  :items="destinationsByCurrentFormTravelRestriction"
                  :loading="loadingDestinations"
                  :rules="[required]"
                  background-color="white"
                  clearable
                  dense
                  label="Final Destination"
                  outlined
                  persistent-hint
                  required
                  validate-on-blur
                >
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-row>
              <v-col
                cols="12"
                md="3"
              >
                <h3>Objectives</h3>
                <ul>
                  <li>Purpose of attendance</li>
                  <li>Relevance and anticipated benefits to branch and Government of Yukon</li>
                </ul>
              </v-col>
              <v-col
                cols="12"
                md="9"
              >
                <v-textarea
                  v-model="currentForm.benefits"
                  :rules="[required]"
                  auto-grow
                  background-color="white"
                  dense
                  label="To meet with colleagues around project x"
                  outlined
                  rows="10"
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { last } from "lodash"
import { mapState, mapActions, mapGetters } from "vuex"

export default {
  name: "PurposeFormCard",
  data: () => ({
    loadingPurposes: false,
    loadingDestinations: false,
    required: (v) => !!v || "This field is required",
  }),
  computed: {
    ...mapState("travelForm", ["currentForm", "purposes"]),
    ...mapGetters("travelForm", ["currentFormId", "destinationsByCurrentFormTravelRestriction"]),
    finalDestination: {
      get() {
        return last(this.currentForm.stops) || { taid: this.currentFormId }
      },
      set(newValue) {
        this.$set(this.currentForm.stops, this.currentForm.stops.length - 1, newValue)
      },
    },
  },
  async mounted() {
    this.loadingPurposes = true
    this.loadingDestinations = true
    await Promise.all([
      this.loadPurposes().finally(() => {
        this.loadingPurposes = false
      }),
      this.loadDestinations().finally(() => {
        this.loadingDestinations = false
      }),
    ])
  },
  methods: {
    ...mapActions("travelForm", ["loadPurposes", "loadDestinations"]),
  },
}
</script>
