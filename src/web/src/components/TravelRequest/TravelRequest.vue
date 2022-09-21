<template>
  <div>
    <h1>Travel Request</h1>
    <div>Current Status: {{ form.formStatus }}</div>
    <v-tabs v-model="tab">
      <v-tab>Travel Form </v-tab>
      <v-tab> Expenses </v-tab>
    </v-tabs>
    <br />
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-form ref="form" lazy-validation>
          <h2>General Information</h2>
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
                  v-model="form.stops[index].travelFrom"
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
                  v-model="form.stops[index - 1].travelFrom"
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
                  v-model="form.stops[index].travelTo"
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
                      v-model="form.stops[index].departureDate"
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
                    v-model="form.stops[index].departureDate"
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
                      v-model="form.stops[index].departureTime"
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
                    format="24hr"
                    scrollable
                    v-model="form.stops[index].departureTime"
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

          <v-btn
            color="primary"
            class="mr-5"
            @click="addStop"
            :disabled="review"
            >Add Stop</v-btn
          >
          <h2>Details</h2>
          <v-row>
            <v-col cols="2">
              <v-text-field
                dense
                v-model="form.travelDuration"
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
                v-model="form.daysNotTravel"
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
                    v-model="form.dateBackToWork"
                    label="Back to work date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :disabled="review"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.dateBackToWork"
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
        <div v-if="review == true">
          <v-btn color="primary" class="mr-5" @click="approveForm()"
            >Approve</v-btn
          >
          <v-btn color="green" class="mr-5" @click="requestChangePopup()">
            Request Changes
          </v-btn>
          <v-btn color="#f3b228" class="mr-5" @click="reassignPopup()">
            Reassign
          </v-btn>
          <v-btn color="red" class="mr-5" @click="denyPopup()">Deny</v-btn>
          <v-btn color="secondary" @click="managePage()">Back</v-btn>
        </div>
        <div v-else>
          <v-btn color="primary" class="mr-5" @click="submitForm()">
            Submit
          </v-btn>
          <v-btn color="green" class="mr-5" @click="saveForm()"
            >Save Draft
          </v-btn>
          <v-btn color="red" class="mr-5" @click="deleteForm()">Delete</v-btn>
          <v-btn color="secondary" @click="requestPage()">Back</v-btn>
        </div>
        <v-snackbar v-model="snackbar" right color="success">
          <v-icon class="mr-3">mdi-thumb-up-outline</v-icon>
          {{ apiSuccess }}
        </v-snackbar>

        <v-dialog v-model="requestChangeDisplay" width="80%">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Change Required
            </v-card-title>

            <v-card-text>
              {{ form.requestChange }}
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" text @click="requestChangeDisplay = false">
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="denyDialog" width="80%">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Request Denied
            </v-card-title>

            <v-card-text>
              Please provide a reason for the denial of this form.
            </v-card-text>
            <v-card-text>
              <v-textarea
                v-model="form.denialReason"
                outlined
                label="Denial Reason"
              ></v-textarea>
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" text @click="denyForm()"> Submit </v-btn>
              <v-btn color="red" text @click="denyDialog = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="reassignDialog" width="80%">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Reassign Form
            </v-card-title>

            <v-card-text> Reassign this form to a new supervisor.</v-card-text>
            <v-card-text>
              <v-combobox
                v-model="reassignEmail"
                outlined
                dense
                label="Supervisor Email"
                persistent-hint
                :items="emails"
                required
                clearable
                :disabled="!review"
                :rules="emailRules"
              ></v-combobox
            ></v-card-text>

            <v-card-actions>
              <v-btn color="primary" text @click="reassignForm()">
                Submit
              </v-btn>
              <v-btn color="red" text @click="reassignDialog = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="requestChangeDialog" width="80%">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Request Change
            </v-card-title>

            <v-card-text>
              What changes need to be made to this form?
            </v-card-text>
            <v-card-text>
              <v-textarea
                v-model="form.requestChange"
                outlined
                label="Requested Changes"
              ></v-textarea>
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" text @click="requestChange()">
                Submit
              </v-btn>
              <v-btn color="red" text @click="requestChangeDialog = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-tab-item>
      <v-tab-item><ExpenseList /></v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { DESTINATION_URL, FORM_URL, LOOKUP_URL, USERS_URL } from "../../urls";
import ExpenseList from "./ExpenseList.vue";
import axios from "axios";
export default {
  name: "Form",
  components: {
    ExpenseList,
  },
  async mounted() {
    if (this.$route.params.manage == "manage") {
      this.review = true;
    }
    this.getDestinations();
    this.getDepartmentList();
    this.form.dateBackToWork = this.getToday();
    this.form.stops[0].departureDate = this.getToday();
    this.form.stops[0].departureTime = "12:00";

    await this.loadEmails();

    await this.getForm(this.$route.params.formId);
    await this.loadUser();

    if (
      this.form.requestChange &&
      this.review == false &&
      this.form.formStatus == "changeRequested"
    ) {
      this.requestChangeDisplay = true;
    }
    this.$refs.form.resetValidation();
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
          travelTo: "",
          travelFrom: "",
          departureDate: "",
          departureTime: "",
          transport: "",
        },
      ],
      travelDuration: "1",
      daysNotTravel: "0",
      mailcode: "",
      travelAdvance: 0,
      dateBackToWork: "",
      purpose: "",
      eventName: "",
      summary: "",
      supervisorEmail: "",
      formStatus: "",
      requestChange: "",
      denialReason: "",
    },

    reassignEmail: "",

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
    tab: null,
    review: false,
    index: 0,
    denyDialog: false,
    requestChangeDialog: false,
    reassignDialog: false,
    requestChangeDisplay: false,

    dateBackToWork: "",

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
      (v) =>
        Number.isInteger(Number(v)) || v == 0 || "This field must be a number",
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
        travelTo: "",
        travelFrom: "",
        departureDate: this.getToday(),
        departureTime: "12:00",
        transport: "",
      });
    },
    removeStop(index) {
      if (this.form.stops.length > 1) this.form.stops.splice(index, 1);
    },
    submitForm() {
      this.showError = false;
      if (this.$refs.form.validate()) {
        let formId = this.form.formId
          ? this.form.formId
          : this.$route.params.formId;
        axios.post(`${FORM_URL}/${formId}/submit`, this.form).then((resp) => {
          console.log(resp);
          this.apiSuccess = "Form submitted successfully";
          this.snackbar = true;
          this.requestPage();
        });
      }
    },
    saveForm() {
      this.$refs.form.resetValidation();
      this.showError = false;
      let formId = this.form.formId
        ? this.form.formId
        : this.$route.params.formId;

      axios.post(`${FORM_URL}/${formId}/save`, this.form).then((resp) => {
        console.log(resp);
        this.apiSuccess = "Form saved as a draft";
        this.snackbar = true;
      });
    },
    deleteForm() {
      let formId = this.form.formId
        ? this.form.formId
        : this.$route.params.formId;

      axios.delete(`${FORM_URL}/${formId}`, this.form).then((resp) => {
        console.log(resp);
        this.apiSuccess = "Form Deleted";
        this.snackbar = true;
        this.requestPage();
      });
    },
    report() {
      console.log(this.stops);
    },

    //Axios gets
    async loadUser() {
      axios.get(`${USERS_URL}`).then((resp) => {
        this.user = resp.data[0];
        console.log(this.user);
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
    async loadEmails() {
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
        new Date(this.form.stops[index].departureDate).getTime() -
        new Date(this.form.stops[0].departureDate).getTime();

      this.form.travelDuration = Difference_In_Time / (1000 * 3600 * 24);
    },
    getToday() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);
    },
    async getForm(formId = "blank") {
      await axios.get(`${FORM_URL}/${formId}`).then((resp) => {
        this.form = resp.data;
      });
    },
    reassignForm() {
      let formId = this.form.formId
        ? this.form.formId
        : this.$route.params.formId;

      axios
        .post(`${FORM_URL}/${formId}/reassign`, {
          reassign: this.reassignEmail,
          form: this.form,
        })
        .then((resp) => {
          console.log(resp);
          this.apiSuccess = "Form reassigned";
          this.snackbar = true;
        });
      this.reassignDialog = false;
      this.managePage();
    },
    denyForm() {
      let formId = this.form.formId
        ? this.form.formId
        : this.$route.params.formId;

      axios.post(`${FORM_URL}/${formId}/deny`, this.form).then((resp) => {
        console.log(resp);
        this.apiSuccess = "Form denied";
        this.snackbar = true;
      });
      this.denyDialog = false;
      this.managePage();
    },
    requestChange() {
      let formId = this.form.formId
        ? this.form.formId
        : this.$route.params.formId;

      axios
        .post(`${FORM_URL}/${formId}/requestChange`, this.form)
        .then((resp) => {
          console.log(resp);
          this.apiSuccess = "Change requested";
          this.snackbar = true;
        });
      this.requestChangeDialog = false;
      this.managePage();
    },
    approveForm() {
      let formId = this.form.formId
        ? this.form.formId
        : this.$route.params.formId;

      axios.post(`${FORM_URL}/${formId}/approve`, this.form).then((resp) => {
        console.log(resp);
        this.apiSuccess = "Form approved";
        this.snackbar = true;
        this.managePage();
      });
    },
    managePage() {
      this.$router.push(`/managerView`);
    },
    requestPage() {
      this.$router.push(`/forms`);
    },
    denyPopup() {
      this.denyDialog = true;
    },
    requestChangePopup() {
      this.requestChangeDialog = true;
    },
    reassignPopup() {
      this.reassignDialog = true;
    },
  },
};
</script>


