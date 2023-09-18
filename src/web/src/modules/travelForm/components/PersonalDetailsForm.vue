<template>
  <v-card elevation="2" class="default">
    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col cols="12" md="6" class="pb-0 mb-0">
            <v-text-field
              dense
              v-model="request.firstName"
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
              v-model="request.lastName"
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
              v-model="request.email"
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
              v-model="request.mailcode"
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
              v-model="request.supervisorEmail"
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
              v-model="request.department"
              label="Department"
              dense
              outlined
              background-color="white"
              item-text="name"
              item-value="name"
              clearable
              :disabled="review"
              :rules="requiredRules"
            ></v-select>
          </v-col>

          <v-col
          v-if="request.department && divisions && divisions.length > 0"
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-select
              :items="divisions"
              v-model="request.division"
              item-text="name"
              item-value="name"
              label="Division"
              dense
              outlined
              background-color="white"
              clearable
              :disabled="review"
            ></v-select>
          </v-col>
          <v-col
            v-if="request.division && branches.length > 0"
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-select
              :items="branches"
              item-text="name"
              v-model="request.branch"
              label="Branch"
              dense
              clearable
              outlined
              background-color="white"
              :disabled="review"
            ></v-select>
          </v-col>
          <v-col
            v-if="request.branch && units.length > 0"
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-select
              :items="units"
              v-model="request.unit"
              item-value="name"
              item-text="name"
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
  name: "PersonalDetailsForm",
  props: ["review", "continue"],
  data: () => ({
    myDivisions: [],
    myBranches: [],
    myUnits: [],
    emails: [],

    //Rules
    firstNameRules: [v => !!v || "First name is required"],
    lastNameRules: [v => !!v || "Last name is required"],
    emailRules: [
      v => !!v || "E-mail is required",
      v =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "E-mail must be valid"
    ],
    fromRules: [v => !!v || "This field is required"],
    destinationRules: [v => !!v || "This field is required"],
    requiredRules: [v => !!v || "This field is required"],
    numberRules: [v => v == 0 || Number.isInteger(Number(v)) || "This field must be a number"]
  }),
  computed: {
    ...mapState("travelForm", ["departments", "request"]),
    divisions() {
      const department = this.departments.find(d => d.name == this.request.department)
      return department?.divisions || [];
    },
    branches() {
      const division = this.divisions.find(d => d.name == this.request.division)
      return division?.branches || [];
    },
    units() {
      const branch = this.branches.find(b => b.name == this.request.branch)
      return branch?.units || [];
    }
  },
  mounted() {},
  methods: {
    search() {},
    emailSearch() {},
    continueClick() {
      let formValid = this.$refs.form.validate();
      if (formValid) this.continue();
    }
  }
};
</script>
