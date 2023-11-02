<template>
  <v-card class="default">
    <v-card-text>
      <v-row>
        <v-col cols="2">
          <v-text-field
            dense
            v-model="request.travelDuration"
            label="# of days in trip"
            required
            background-color="white"
            outlined
            :disabled="review"
            :rules="numberRules"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            dense
            v-model="request.daysOffTravelStatus"
            label="# of days OFF travel status"
            required
            background-color="white"
            outlined
            :disabled="review"
            :rules="numberRules"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-menu
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
            v-model="btwMenu"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                dense
                v-model="request.dateBackToWork"
                label="Back to work date"
                prepend-icon="mdi-calendar"
                readonly
                background-color="white"
                outlined
                v-bind="attrs"
                v-on="on"
                :disabled="review"
              ></v-text-field>
            </template>
            <v-date-picker v-model="request.dateBackToWork" @input="btwMenu = false"></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5">
          <v-select
            :items="purposes"
            label="Purpose"
            v-model="request.purposeId"
            dense
            item-value="id"
            item-text="purpose"
            background-color="white"
            outlined
            :disabled="review"
            :rules="requiredRules"
          ></v-select
        ></v-col>
        <v-col cols="3">
          <v-text-field
            dense
            v-model="travelAdvanceInDollars"
            label="Travel Advance"
            required
            background-color="white"
            outlined
            prefix="$"
            :disabled="review"
            :rules="numberRules"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model="request.eventName"
            dense
            background-color="white"
            outlined
            label="Name of meeting/conference, mission, trade fair or course"
            required
            :disabled="review"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="request.summary"
            label="Purpose of attendance"
            :disabled="review"
            :rules="requiredRules"
            dense
            background-color="white"
            outlined
            rows="1"
            auto-grow
          >
          </v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="request.benefits"
            label="Relevance and anticipated benefits to branch and Government of Yukon"
            :disabled="review"
            :rules="requiredRules"
            dense
            background-color="white"
            outlined
            rows="1"
            auto-grow
          >
          </v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="mr-auto pb-0">
          <v-btn color="secondary" @click="backClick">
            Back
          </v-btn>
        </v-col>

        <v-col class="col-auto pb-0">
          <v-btn color="primary" @click="continueClick">
            {{ continueTitle || "Continue" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "TravelDetailsForm",
  props: ["review", "continue", "continueTitle", "back"],
  data: () => ({
    btwMenu: false,

    //Rules
    requiredRules: [(v) => !!v || "This field is required"],
    numberRules: [(v) => v == 0 || Number.isInteger(Number(v)) || "This field must be a number"],
  }),
  computed: {
    ...mapState("travelAuthorizations", ["purposes", "request"]),
    travelAdvanceInDollars: {
      get() {
        return Math.ceil(this.request.travelAdvanceInCents / 100.0);
      },
      set(value) {
        this.request.travelAdvanceInCents = Math.ceil(value * 100);
      },
    },
  },
  async mounted() {
    this.loadPurposes();
  },
  methods: {
    ...mapActions("travelAuthorizations", ["loadPurposes"]),
    continueClick() {
      this.continue();
    },
    backClick() {
      this.back();
    },
  },
};
</script>
