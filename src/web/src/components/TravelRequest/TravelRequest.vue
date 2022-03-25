<template>
  <div class="books">
    <h1>Travel Request</h1>

    <p></p>
    <v-form>
      <v-row>
        <div class="col-2">
          <v-text-field
            dense
            v-model="tanumber"
            outlined
            label="TA No"
            required
            disabled
            filled
          ></v-text-field>
        </div>
      </v-row>
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
          <v-autocomplete
            label="Department"
            v-model="department"
            outlined
            dense
            required
            :items="depts"
          ></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-autocomplete
            label="Branch"
            v-model="branch"
            outlined
            dense
            required
            :items="branches"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-autocomplete
            v-model="from"
            outlined
            dense
            label="Where you are travelling from?"
            persistent-hint
            :items="froms"
            required
            clearable
            :rules="fromRules"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="email"
            dense
            outlined
            label="Email"
            required
            :rules="emailRules"
          ></v-text-field>
        </v-col>
      </v-row>

      <h2>Stops</h2>
      <v-row v-for="(stop, index) in stops" :key="index">
        <v-col cols="3">
          <v-autocomplete
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
        </v-col>
        <v-col cols="4">
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
                v-model="stops[index].arrivalDate"
                label="Arrival Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="stops[index].arrivalDate"
              @input="arrivalMenu[index] = false"
            ></v-date-picker> </v-menu
        ></v-col>
        <v-col cols="4">
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
                v-model="stops[index].departureDate"
                label="Departure Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="stops[index].departureDate"
              @input="departureMenu[index] = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="1">
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
        <v-col cols="12">
          <v-textarea v-model="summary" outlined label="Travel Summary">
          </v-textarea>
        </v-col>
      </v-row>
    </v-form>

    <v-btn color="primary" class="mr-5" @click="saveForm">Submit</v-btn>
    <v-btn color="secondary">Cancel</v-btn>

    <v-snackbar v-model="snackbar" right color="success">
      <v-icon class="mr-3">mdi-thumb-up-outline</v-icon>
      {{ apiSuccess }}
    </v-snackbar>
  </div>
</template>

<script>
import { DESTINATION_URL, FORM_URL } from "../../urls";
import axios from "axios";
export default {
  name: "Form",
  created() {
    this.getDestinations();
    this.stops.push({
      destination: "",
      arrivalDate: this.getToday(),
      departureDate: this.getToday(),
    });
    this.backToWorkDate = this.getToday();
  },
  data: () => ({
    daysNotTraveling: 0,
    totalTripLength: 1,
    backToWorkDate: "",
    summary: "",
    stops: [],
    arrivalMenu: [],
    departureMenu: [],
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
    depts: [
      "Community Services",
      "Economic Development",
      "Education",
      "Energy, Mines and Resources",
      "Environment",
      "Executive Council Office",
      "Finance",
      "French Language Services Directorate",
      "Health and Social Services",
      "Highways and Public Works",
      "Justice",
      "Public Service Commission",
      "Tourism and Culture",
      "Women Gender Equity Directorate",
      "Yukon Energy Corporation",
      "Yukon Development Corporation",
      "Yukon Housing Corporation",
      "Yukon Liquor Corporation",
      "Yukon Lottery Commission and Lotteries Yukon",
      "Yukon Workers' Compensation Health and Safety Board",
    ],
    branch: "",
    branches: ["ICT", "TAD", "TEB", "TMB"],
    email: "",
    emailRules: [
      (v) => !!v || "Email is required",
      (v) => {
        if (v) return true;

        return "";
      },
    ],
    from: "Whitehorse",
    fromRules: [(v) => !!v || "This field is required"],
    froms: [
      "Whitehorse",
      "Carcross",
      "Dawson",
      "Faro",
      "Haines Junction",
      "Mayo",
      "Teslin",
      "Watson Lake",
      "Old Crow",
      "Otter Falls",
      "Ealge Plains",
      "Salmon Arm",
    ],
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
        arrivalDate: this.getToday(),
        departureDate: this.getToday(),
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
      console.log(this.destinations);
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
  },
};
</script>


