<template>
  <v-card class="default">
    <v-card-text>
      <v-row>
        <v-col cols="2">
          <v-text-field
            dense
            v-model="form.travelDuration"
            label="# of days in trip"
            required
            :disabled="review"
            :rules="numberRules"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            dense
            v-model="form.daysOffTravelStatus"
            label="# of days OFF travel status"
            required
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
                v-model="form.dateBackToWork"
                label="Back to work date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                :disabled="review"
              ></v-text-field>
            </template>
            <v-date-picker v-model="form.dateBackToWork" @input="btwMenu = false"></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5">
          <v-select
            :items="purposes"
            label="Purpose"
            v-model="form.purpose"
            dense
            :disabled="review"
            :rules="requiredRules"
          ></v-select
        ></v-col>
        <v-col cols="3">
          <v-text-field
            dense
            v-model="form.travelAdvance"
            label="Travel Advance"
            required
            prefix="$"
            :disabled="review"
            :rules="numberRules"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model="form.eventName"
            dense
            label="Name of meeting/conference, mission, trade fair or course"
            required
            :disabled="review"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="form.summary"
            label="Purpose of attendance"
            :disabled="review"
            :rules="requiredRules"
            dense
            rows="1"
            auto-grow
          >
          </v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="form.benefits"
            label="Relevance and anticipated benefits to branch and Government of Yukon"
            :disabled="review"
            :rules="requiredRules"
            dense
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
            Continue
          </v-btn>
        </v-col>
      </v-row>


    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Form",
  props: ["form", "review", "continue", "back"],
  data: () => ({
    btwMenu: false,
    purposes: [],

    //Rules
    firstNameRules: [(v) => !!v || "First name is required"],
    lastNameRules: [(v) => !!v || "Last name is required"],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "E-mail must be valid",
    ],
    fromRules: [(v) => !!v || "This field is required"],
    destinationRules: [(v) => !!v || "This field is required"],
    requiredRules: [(v) => !!v || "This field is required"],
    numberRules: [(v) => v == 0 || Number.isInteger(Number(v)) || "This field must be a number"],
  }),
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
