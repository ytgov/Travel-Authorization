<template>
  <div>
    <h1>Travel Request</h1>
    <h2>General Information</h2>

    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col class="col-4">
          <v-text-field
            dense
            v-model="form.firstName"
            outlined
            label="First name"
            required
            :rules="firstNameRules"
            :disabled="review"
          ></v-text-field>
        </v-col>
        <v-col class="col-4">
          <v-text-field
            dense
            v-model="form.lastName"
            outlined
            label="Last name"
            required
            :rules="lastNameRules"
            :disabled="review"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="4">
          <v-select
            :items="myDepartments"
            v-model="form.department"
            label="Department"
            outlined
            dense
            clearable
            background-color="white"
            :disabled="review"
            :rules="requiredRules"
          ></v-select>
        </v-col>

        <v-col cols="4">
          <v-select
            :items="myDivisions"
            v-model="form.division"
            label="Division"
            outlined
            dense
            clearable
            background-color="white"
            :disabled="review"
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="4">
          <v-select
            :items="myBranches"
            v-model="form.branch"
            label="Branch"
            outlined
            dense
            clearable
            background-color="white"
            :disabled="review"
          ></v-select>
        </v-col>

        <v-col cols="4">
          <v-select
            :items="myUnits"
            v-model="form.unit"
            label="Unit"
            outlined
            dense
            clearable
            background-color="white"
            :disabled="review"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="form.email"
            dense
            outlined
            label="Email"
            required
            :rules="emailRules"
            :disabled="review"
          ></v-text-field
        ></v-col>
        <v-col cols="4">
          <v-text-field
            v-model="form.mailcode"
            dense
            outlined
            label="mailcode"
            required
            :disabled="review"
            :rules="requiredRules"
          ></v-text-field>
        </v-col>
      </v-row>
      <h2>Itinerary</h2>
      <div v-for="(stop, index) in form.stops" :key="index">
        <v-divider class="mb-6" v-if="index > 0" />
        <v-row>
          <v-col cols="2">
            <v-autocomplete
              v-if="index == 0"
              v-model="form.stops[index].from"
              outlined
              dense
              label="From"
              persistent-hint
              :items="destinations"
              :item-text="destinations.text"
              :item-value="destinations.value"
              required
              clearable
              :rules="destinationRules"
              :disabled="review"
            >
            </v-autocomplete>
            <v-autocomplete
              v-if="index > 0"
              v-model="form.stops[index - 1].to"
              outlined
              dense
              label="From"
              persistent-hint
              :items="destinations"
              :item-text="destinations.text"
              :item-value="destinations.value"
              required
              clearable
              :rules="destinationRules"
              :disabled="review"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="2">
            <v-autocomplete
              v-model="form.stops[index].to"
              outlined
              dense
              label="To"
              persistent-hint
              :items="destinations"
              :item-text="destinations.text"
              :item-value="destinations.value"
              required
              clearable
              :rules="destinationRules"
              :disabled="review"
            >
            </v-autocomplete>
          </v-col>

          <!-- Departure date -->
          <v-col cols="2">
            <v-menu
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
              v-model="departureMenu[index]"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  outlined
                  dense
                  v-model="form.stops[index].departuredate"
                  label="Departure Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :disabled="review"
                  :rules="requiredRules"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.stops[index].departuredate"
                @input="departureMenu[index] = false"
                @change="calculateDaysGone(index)"
                :rules="requiredRules"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <!-- Departure time -->
          <v-col cols="2">
            <v-menu
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
              v-model="departureTimeMenu[index]"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  outlined
                  dense
                  v-model="form.stops[index].departuretime"
                  label="Departure Time"
                  prepend-icon="mdi-clock"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :disabled="review"
                  :rules="requiredRules"
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="form.stops[index].departuretime"
                @input="departureTimeMenu[index] = false"
                :rules="requiredRules"
              ></v-time-picker> </v-menu
          ></v-col>
          <v-col cols="2">
            <v-select
              :items="transport"
              label="Method of transport"
              v-model="form.stops[index].transport"
              dense
              outlined
              :disabled="review"
              :rules="requiredRules"
            ></v-select
          ></v-col>
          <!-- Delete button -->
          <v-col cols="1" v-if="index > 0">
            <v-btn
              class="ma-2"
              dense
              small
              color="red"
              @click="removeStop(index)"
              :disabled="review"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-btn color="primary" class="mr-5" @click="addStop">Add Stop</v-btn>
      <h2>Details</h2>
      <v-row>
        <v-col cols="2">
          <v-text-field
            dense
            v-model="form.totalTripLength"
            outlined
            label="# of days in trip"
            required
            :disabled="review"
            :rules="numberRules"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            dense
            v-model="form.daysNotTraveling"
            outlined
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
                outlined
                dense
                v-model="form.backToWorkDate"
                label="Back to work date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                :disabled="review"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="form.backToWorkDate"
              @input="btwMenu = false"
            ></v-date-picker>
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
            outlined
            :disabled="review"
            :rules="requiredRules"
          ></v-select
        ></v-col>
        <v-col cols="3">
          <v-text-field
            dense
            v-model="form.travelAdvance"
            outlined
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
            outlined
            label="Event Name (If applicable)"
            required
            :disabled="review"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="form.summary"
            outlined
            label="General Travel Information"
            :disabled="review"
            :rules="requiredRules"
          >
          </v-textarea>
        </v-col>
      </v-row>

      <h2>Finalize</h2>
      <v-row>
        <v-col cols="4">
          <v-combobox
            v-model="form.supervisorEmail"
            outlined
            dense
            label="Supervisor Email"
            persistent-hint
            :items="emails"
            required
            clearable
            :disabled="review"
            :rules="emailRules"
          ></v-combobox>
        </v-col>
      </v-row>
    </v-form>
    <div v-if="!review">
      <v-btn color="primary" class="mr-5" @click="submitForm">Submit</v-btn>
      <v-btn
        v-if="form.status == 'Draft'"
        color="green"
        class="mr-5"
        @click="saveForm"
        >Save Draft</v-btn
      >
      <v-btn color="secondary" @click="report">Cancel</v-btn>
    </div>
    <div v-else>
      <v-btn color="primary" class="mr-5" @click="saveForm">Approve</v-btn>
      <v-btn color="green" class="mr-5" @click="saveForm"
        >Request Changes</v-btn
      >
      <v-btn color="#f3b228" class="mr-5" @click="saveForm">Reasign</v-btn>
      <v-btn color="red" @click="report">Deny</v-btn>
    </div>
    <v-snackbar v-model="snackbar" right color="success">
      <v-icon class="mr-3">mdi-thumb-up-outline</v-icon>
      {{ apiSuccess }}
    </v-snackbar>
  </div>
</template>

<script>
import { DESTINATION_URL, FORM_URL, LOOKUP_URL, USERS_URL } from "../../urls";
import axios from "axios";
export default {
  name: "Form",
  created() {
    this.getDestinations();
    this.getDepartmentList();
    this.form.backToWorkDate = this.getToday();
    this.form.stops[0].departuredate = this.getToday();
    this.loadUser();
    this.loadEmails();
  },
  data: () => ({
    //Form
    form: {
      firstName: "",
      lastName: "",
      department: "",
      division: "",
      branch: "",
      unit: "",
      stops: [
        {
          to: "",
          from: "",
          departuredate: "",
          departuretime: "",
          transport: "",
        },
      ],
      totalTripLength: "1",
      daysNotTraveling: "0",
      mailcode: "",
      travelAdvance: "0",
      purpose: "",
      eventName: "",
      summary: "",
      supervisorEmail: "",
      status: "",
    },

    //Dropdowns
    transport: ["Rental vehicle", "Personal vehicle", "Fleet vehicle", "Plane"],
    purposes: [
      "Maintenance",
      "Conference",
      "Workshop",
      "General Travel",
      "Community Travel",
    ],

    //Dropdowns that need initialization
    departments: {},
    divisons: {},
    branches: {},
    units: [],
    emails: [],
    destinations: [],

    //Form functionality variables
    review: false,
    index: 0,

    backToWorkDate: "",

    departureMenu: [],
    departureTimeMenu: [],
    btwMenu: false,

    showError: null,
    snackbar: null,
    apiSuccess: "",

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
    numberRules: [
      (v) => !!v || "This field is required",
      (v) => Number.isInteger(Number(v)) || "This field must be a number",
    ],
  }),
  computed: {
    myDepartments: function () {
      return Object.keys(this.departments);
    },
    myDivisions: function () {
      if (this.departments[this.form.department]) {
        return Object.keys(this.departments[this.form.department]);
      }
      return [];
    },
    myBranches: function () {
      if (
        this.departments[this.form.department] &&
        this.departments[this.form.department][this.form.division]
      ) {
        return Object.keys(
          this.departments[this.form.department][this.form.division]
        );
      }
      return [];
    },
    myUnits: function () {
      if (
        this.departments[this.form.department] &&
        this.departments[this.form.department][this.form.division] &&
        this.departments[this.form.department][this.form.division][
          this.form.branch
        ]
      ) {
        return this.departments[this.form.department][this.form.division][
          this.form.branch
        ];
      }
      return [];
    },
  },
  methods: {
    addStop() {
      this.form.stops.push({
        to: "",
        from: "",
        departuredate: this.getToday(),
        departuretime: "",
        transport: "",
      });
    },
    removeStop(index) {
      if (this.form.stops.length > 1) this.form.stops.splice(index, 1);
    },

    submitForm() {
      this.showError = false;
      console.log("log", this.$refs.form.validate());

      axios.post(`${FORM_URL}`, this.form).then((resp) => {
        console.log(resp);
      });
      console.log(this.form);

      if (this.from == "Whitehorse") {
        this.snackbar = true;
        this.apiSuccess = "Your form has been submitted to your supervisor";
      } else {
        this.showError = true;
      }
    },
    saveForm() {
      this.showError = false;
      this.form.status = "Draft";
      axios.post(`${FORM_URL}`, this.form).then((resp) => {
        console.log(resp);
      });
      console.log(this.form);

      if (true) {
        this.snackbar = true;
        this.apiSuccess = "Your form has been saved as a draft";
      } else {
        this.showError = true;
      }
    },
    report() {
      console.log(this.stops);
    },

    //Axios gets
    loadUser() {
      axios.get(`${USERS_URL}`).then((resp) => {
        this.user = resp.data[0];
        this.form.firstName =
          this.user.first_name[0].toUpperCase() +
          this.user.first_name.substring(1);
        this.form.lastName =
          this.user.last_name[0].toUpperCase() +
          this.user.last_name.substring(1);
        this.form.email = this.user.email;
      });
      axios.get(`${USERS_URL}/unit`).then((resp) => {
        this.form.department = resp.data.department;
        this.form.division = resp.data.division;
        this.form.branch = resp.data.branch;
        this.form.unit = resp.data.unit;
        this.form.mailcode = resp.data.mailcode;
      });
    },
    loadEmails() {
      axios.get(`${LOOKUP_URL}/emailList`).then((resp) => {
        this.emails = resp.data;
      });
    },
    getDepartmentList() {
      axios.get(`${LOOKUP_URL}/departmentList`).then((resp) => {
        this.departments = resp.data;
      });
    },
    getDestinations() {
      axios.get(`${DESTINATION_URL}`).then((resp) => {
        resp.data.forEach((v) => {
          this.destinations.push({
            value: v.id,
            text: v.city + " (" + v.province + ")",
          });
        });
      });
    },

    //Helpers
    calculateDaysGone(index) {
      var Difference_In_Time =
        new Date(this.form.stops[index].departuredate).getTime() -
        new Date(this.form.stops[0].departuredate).getTime();

      this.form.totalTripLength = Difference_In_Time / (1000 * 3600 * 24);
    },
    getToday() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);
    },
  },
};
</script>


