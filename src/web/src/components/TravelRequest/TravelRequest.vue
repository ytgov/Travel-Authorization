<template>
  <div class="books">
    <h1>Travel Request</h1>
    <v-divider />
    <h2>General Information</h2>

    <v-form>
      <v-row>
        <v-col class="col-4">
          <v-text-field
            dense
            v-model="firstName"
            outlined
            label="First name"
            required
            :rules="firstNameRules"
          ></v-text-field>
        </v-col>
        <v-col class="col-4">
          <v-text-field
            dense
            v-model="lastName"
            outlined
            label="Last name"
            required
            :rules="lastNameRules"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="4">
          <v-text-field
            label="Department"
            v-model="department"
            outlined
            dense
            required
            :items="depts"
            item-text="name"
            item-value="id"
            @input="getBranches"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-autocomplete
            label="Division"
            v-model="division"
            outlined
            dense
            required
            :items="branches"
            item-text="name"
            item-value="id"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-autocomplete
            label="Branch"
            v-model="branch"
            outlined
            dense
            required
            :items="branches"
            item-text="name"
            item-value="id"
          ></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-autocomplete
            label="Unit"
            v-model="unit"
            outlined
            dense
            required
            :items="branches"
            item-text="name"
            item-value="id"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="email"
            dense
            outlined
            label="Email"
            required
            :rules="emailRules"
          ></v-text-field
        ></v-col>
        <v-col cols="4">
          <v-text-field
            v-model="supervisorEmail"
            dense
            outlined
            label="Supervisor Email"
            required
            :rules="emailRules"
          ></v-text-field>
        </v-col>
      </v-row>

      <h2>Itinerary</h2>
      <div v-for="(stop, index) in stops" :key="index">
        <div v-if="index > 0">
          <v-row>
            <v-col><v-icon>mdi-arrow-down-thick</v-icon></v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-select
                :items="transport"
                label="Method of transport"
                dense
                outlined
              ></v-select
            ></v-col>
          </v-row>
          <v-row>
            <v-col><v-icon>mdi-arrow-down-thick</v-icon></v-col>
          </v-row>
        </div>
        <v-row>
          <v-col cols="3">
            <v-autocomplete
              v-if="index > 0"
              v-model="stops[index].destination"
              outlined
              dense
              label="Where you are travelling to?"
              persistent-hint
              :items="destinations"
              :item-text="destinations.text"
              :item-value="destinations.value"
              required
              clearable
              :rules="destinationRules"
            >
            </v-autocomplete>
            <v-autocomplete
              v-else
              v-model="stops[index].destination"
              outlined
              dense
              label="Starting location"
              persistent-hint
              :items="destinations"
              :item-text="destinations.text"
              :item-value="destinations.value"
              required
              clearable
              :rules="destinationRules"
            >
            </v-autocomplete>
          </v-col>
          <!-- Arrival date -->
          <v-col cols="2" v-if="index > 0">
            <v-menu
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
              v-model="arrivalMenu[index]"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  outlined
                  dense
                  v-model="stops[index].arrivaldate"
                  label="Arrival Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="stops[index].arrivaldate"
                @input="arrivalMenu[index] = false"
              ></v-date-picker> </v-menu
          ></v-col>
          <!-- Arrival time -->
          <v-col cols="2" v-if="index > 0">
            <v-menu
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
              v-model="arrivalTimeMenu[index]"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  outlined
                  dense
                  v-model="stops[index].arrivaltime"
                  label="Arrival Time"
                  prepend-icon="mdi-clock"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="stops[index].arrivaltime"
                @input="arrivalTimeMenu[index] = false"
              ></v-time-picker> </v-menu
          ></v-col>
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
                  v-model="stops[index].departuredate"
                  label="Departure Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="stops[index].departuredate"
                @input="departureMenu[index] = false"
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
                  v-model="stops[index].departuretime"
                  label="Departure Time"
                  prepend-icon="mdi-clock"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="stops[index].departuretime"
                @input="departureTimeMenu[index] = false"
              ></v-time-picker> </v-menu
          ></v-col>
          <!-- Delete button -->
          <v-col cols="1" v-if="index > 0">
            <v-btn
              class="ma-2"
              dense
              small
              color="red"
              @click="removeStop(index)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Final Destination -->

      <v-row>
        <v-col><v-icon>mdi-arrow-down-thick</v-icon></v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-select
            :items="transport"
            label="Method of transport"
            dense
            outlined
          ></v-select
        ></v-col>
      </v-row>
      <v-row>
        <v-col><v-icon>mdi-arrow-down-thick</v-icon></v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <v-autocomplete
            v-model="destination"
            outlined
            dense
            label="Return Destination"
            persistent-hint
            :items="destinations"
            :item-text="destinations.text"
            :item-value="destinations.value"
            required
            clearable
            :rules="destinationRules"
          >
          </v-autocomplete>
        </v-col>
        <!-- Destination date -->
        <v-col cols="2" v-if="index > 0">
          <v-menu
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
            v-model="destinationMenu"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                dense
                v-model="destinationDate"
                label="Arrival Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="destinationDate"
              @input="destinationMenu = false"
            ></v-date-picker> </v-menu
        ></v-col>
        <!-- Destination time -->
        <v-col cols="2" v-if="index > 0">
          <v-menu
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
            v-model="destinationTimeMenu"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                dense
                v-model="destinationTime"
                label="Arrival Time"
                prepend-icon="mdi-clock"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-model="destinationTime"
              @input="destinationTimeMenu = false"
            ></v-time-picker> </v-menu
        ></v-col>
      </v-row>

      <v-btn color="primary" class="mr-5" @click="addStop">Add Stop</v-btn>
      <h2>Details</h2>
      <v-row>
        <v-col cols="2">
          <v-text-field
            dense
            v-model="totalTripLength"
            outlined
            label="# of days in trip"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            dense
            v-model="daysNotTraveling"
            outlined
            label="# of days NOT traveling"
            required
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
                v-model="backToWorkDate"
                label="Back to work date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="backToWorkDate"
              @input="btwMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-select :items="purposes" label="Purpose" dense outlined></v-select
        ></v-col>
      </v-row>
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model="email"
            dense
            outlined
            label="Event Name (If applicable)"
            required
            :rules="emailRules"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea v-model="summary" outlined label="Travel Summary">
          </v-textarea>
        </v-col>
      </v-row>
    </v-form>

    <v-btn color="primary" class="mr-5" @click="saveForm">Submit</v-btn>
    <v-btn color="secondary" @click="report">Cancel</v-btn>

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
    this.getDepartments();
    this.stops.push({
      destination: "",
      arrivaldate: this.getToday(),
      departuredate: this.getToday(),
      arrivaltime: "",
      departuretime: "",
    });
    this.backToWorkDate = this.getToday();
    this.destinationDate = this.getToday();
    this.loadUser();
  },
  data: () => ({
    index: 0,
    daysNotTraveling: 0,
    totalTripLength: 1,
    backToWorkDate: "",
    summary: "",
    stops: [],
    arrivalMenu: [],
    departureMenu: [],
    arrivalTimeMenu: [],
    departureTimeMenu: [],
    destinationDate: "",
    destinationTime: "",
    destinationMenu: "",
    destinationTimeMenu: "",
    btwMenu: false,
    tanumber: "12343",
    firstName: "",
    firstNameRules: [
      (v) => !!v || "First name is required",
      (v) =>
        (v && v.length <= 10) || "First name must be less than 10 characters",
    ],
    lastName: "",
    lastNameRules: [
      (v) => !!v || "Last name is required",
      (v) =>
        (v && v.length <= 10) || "Last name must be less than 10 characters",
    ],
    department: "",
    division: "",
    branch: "",
    unit: "",
    depts: [],
    divisions: [],
    branches: [],
    units: [],
    email: "",
    supervisorEmail: "",
    emailRules: [
      (v) => !!v || "Email is required",
      (v) => {
        if (v) return true;

        return "";
      },
    ],
    from: "Whitehorse",
    fromRules: [(v) => !!v || "This field is required"],
    transport: ["Rental vehicle", "Personal vehicle", "Fleet vehicle", "Plane"],
    purposes: ["Maintenance", "Conference", "Workshop"],
    destination: "",
    destinationRules: [(v) => !!v || "This field is required"],
    destinations: [],
    dates: [],
    showError: null,
    snackbar: null,
    apiSuccess: "",
  }),
  methods: {
    getToday() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);
    },
    addStop() {
      this.stops.push({
        destination: "",
        arrivaldate: this.getToday(),
        departuredate: this.getToday(),
      });
    },
    removeStop(index) {
      if (this.stops.length > 1) this.stops.splice(index, 1);
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
    getDepartments() {
      axios.get(`${LOOKUP_URL}/departments`).then((resp) => {
        this.depts = resp.data;
      });
    },
    getBranches() {
      axios.get(`${LOOKUP_URL}/department/${this.department}`).then((resp) => {
        this.branches = resp.data;
      });
    },
    saveForm() {
      this.showError = false;
      let form = {
        taid: this.tanumber,
        firstname: this.firstName,
        lastname: this.lastName,
        department: this.department,
        branch: this.branch,
        email: this.email,
        summary: this.summary,
        stops: this.stops,
        daysnotTravel: this.daysNotTraveling,
        travelduartion: this.totalTripLength,
        datebacktowork: this.backToWorkDate,
      };

      axios.post(`${FORM_URL}`, form).then((resp) => {
        console.log(resp);
      });

      console.log("SAVING " + this.team);

      if (this.from == "Whitehorse") {
        this.snackbar = true;
        this.apiSuccess = "Your form has been submitted to your supervisor";
      } else {
        this.showError = true;
      }
    },
    report() {
      console.log(this.stops);
    },
    loadUser() {
      axios.get(`${USERS_URL}`).then((resp) => {
        this.user = resp.data[0];
        this.firstName = this.user.first_name;
        this.lastName = this.user.last_name;
        this.email = this.user.email;
      });
      axios.get(`${USERS_URL}/unit`).then((resp) => {
        this.department = resp.data.department;
        this.division = resp.data.division;
        this.branch = resp.data.branch;
        this.unit = resp.data.unit;
      });
    },
  },
};
</script>


