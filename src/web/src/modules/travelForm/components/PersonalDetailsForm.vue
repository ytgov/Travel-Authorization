<template>
  <v-card elevation="2" class="default">
    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col cols="12" md="6" class="pb-0 mb-0">
            <v-text-field
              dense
              v-model="form.firstName"
              label="First name"
              required
              outlined
              background-color="white"
              :rules="firstNameRules"
              :disabled="review"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="pb-0 mb-0">
            <v-text-field
              dense
              v-model="form.lastName"
              label="Last name"
              required
              outlined
              background-color="white"
              :rules="lastNameRules"
              :disabled="review"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6" class="pb-0 mb-0">
            <v-text-field
              v-model="form.email"
              dense
              outlined
              background-color="white"
              label="Email"
              required
              :rules="emailRules"
              :disabled="review"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="pb-0 mb-0">
            <v-text-field
              v-model="form.mailcode"
              dense
              outlined
              background-color="white"
              label="Mailcode"
              required
              :disabled="review"
              :rules="requiredRules"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="12" class="pb-0 mb-0">
            <v-combobox
              v-model="form.supervisorEmail"
              dense
              outlined
              background-color="white"
              label="Supervisor Email"
              persistent-hint
              :items="emails"
              required
              clearable
              v-on:keyup="search"
              :disabled="review"
              :rules="emailRules"
              @input.native="emailSearch = $event.srcElement.value"
              :return-object="false"
            ></v-combobox>
          </v-col>

          <v-col cols="12" md="6" class="pb-0 mb-0">
            <v-select
              :items="departments"
              v-model="form.department"
              return-object
              label="Department"
              dense
              outlined
              background-color="white"
              item-text="name"
              clearable
              :disabled="review"
              :rules="requiredRules"
            ></v-select>
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="pb-0 mb-0"
            v-if="form.department && form.department.divisions && form.department.divisions.length > 0"
          >
            <v-select
              :items="form.department.divisions"
              v-model="form.division"
              return-object
              item-text="name"
              label="Division"
              dense
              outlined
              background-color="white"
              clearable
              :disabled="review"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6" class="pb-0 mb-0" v-if="form.division && form.division.branches.length > 0">
            <v-select
              :items="form.division.branches"
              item-text="name"
              v-model="form.branch"
              return-object
              label="Branch"
              dense
              clearable
              outlined
              background-color="white"
              :disabled="review"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6" class="pb-0 mb-0" v-if="form.branch && form.branch.units.length > 0">
            <v-select
              :items="form.branch.units"
              v-model="form.unit"
              label="Unit"
              dense
              clearable
              outlined
              background-color="white"
              :disabled="review"
            ></v-select>
          </v-col>
        </v-row>
      </v-form>

      <v-row>
        <v-col class="mr-auto pb-0">
          <v-btn to="/my-travel-requests" color="secondary">
            Cancel
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
import { mapState } from "vuex";

export default {
  name: "Form",
  props: ["form", "review", "continue"],
  data: () => ({
    myDivisions: [],
    myBranches: [],
    myUnits: [],
    emails: [],

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
  computed: {
    ...mapState("travelForm", ["departments"]),
  },
  methods: {
    search() {},
    emailSearch() {},
    continueClick() {
      let formValid = this.$refs.form.validate();
      if (formValid) this.continue();
    },
  },
};
</script>
