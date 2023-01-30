<template>
  <div>
    <v-row>
      <h1>Travel Request</h1>
      <v-spacer> </v-spacer>
      <h3>
        Current Status:
        {{ form.status }}
      </h3>
    </v-row>
    <v-tabs v-model="tab">
      <v-tab>Travel Form </v-tab>
      <v-tab>Estimates</v-tab>
      <v-tab>Expenses</v-tab>
      <v-tab>Trip Report</v-tab>
    </v-tabs>
    <br />
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-form ref="form" lazy-validation>
          <v-card elevation="2" class="mt-5">
            <v-card-title>
              <h2>Personal Information</h2>
            </v-card-title>
            <v-card-text
              ><v-row>
                <v-col>
                  <v-text-field
                    dense
                    v-model="form.firstName"
                    label="First name"
                    required
                    :rules="firstNameRules"
                    :disabled="review"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    dense
                    v-model="form.lastName"
                    label="Last name"
                    required
                    :rules="lastNameRules"
                    :disabled="review"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-select
                    :items="myDepartments"
                    v-model="form.department"
                    label="Department"
                    dense
                    clearable
                    background-color="white"
                    :disabled="review"
                    :rules="requiredRules"
                  ></v-select>
                </v-col>

                <v-col>
                  <v-select
                    :items="myDivisions"
                    v-model="form.division"
                    label="Division"
                    dense
                    clearable
                    background-color="white"
                    :disabled="review"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-select
                    :items="myBranches"
                    v-model="form.branch"
                    label="Branch"
                    dense
                    clearable
                    background-color="white"
                    :disabled="review"
                  ></v-select>
                </v-col>

                <v-col>
                  <v-select
                    :items="myUnits"
                    v-model="form.unit"
                    label="Unit"
                    dense
                    clearable
                    background-color="white"
                    :disabled="review"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="form.email"
                    dense
                    label="Email"
                    required
                    :rules="emailRules"
                    :disabled="review"
                  ></v-text-field
                ></v-col>
                <v-col>
                  <v-text-field
                    v-model="form.mailcode"
                    dense
                    label="Mailcode"
                    required
                    :disabled="review"
                    :rules="requiredRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-combobox
                    v-model="form.supervisorEmail"
                    dense
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
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="2" class="mt-5">
            <v-card-title>
              <h2>stops</h2>
            </v-card-title>
            <v-card-text>
              <stops :review="review" :stops="form.stops" :multiStop="form.multiStop" :oneWayTrip="form.oneWayTrip" />
            </v-card-text>
          </v-card>

          <v-card elevation="2" class="mt-5">
            <v-card-title class="text-center">
              <h3>Travel Details</h3>
            </v-card-title>
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
            </v-card-text>
          </v-card>
        </v-form>
        <div v-if="review == true">
          <v-btn color="blue" class="mr-5" @click="approveForm()">Approve</v-btn>
          <v-btn color="green" class="mr-5" @click="requestChangePopup()"> Request Changes </v-btn>
          <v-btn color="#f3b228" class="mr-5" @click="reassignPopup()"> Reassign </v-btn>
          <v-btn color="red" class="mr-5" @click="denyPopup()">Deny</v-btn>
          <v-btn color="secondary" @click="managePage()">Back</v-btn>
        </div>
        <div v-else>
          <v-btn color="blue" class="mr-5" @click="submitForm()"> Submit </v-btn>
          <v-btn color="green" class="mr-5" @click="saveForm()">Save Draft </v-btn>
          <v-btn color="red" class="mr-5" @click="deleteForm()">Delete</v-btn>
          <v-btn color="secondary" @click="requestPage()">Back</v-btn>
        </div>
        <v-snackbar v-model="snackbar" right color="success">
          <v-icon class="mr-3">mdi-thumb-up-outline</v-icon>
          {{ apiSuccess }}
        </v-snackbar>

        <v-dialog v-model="requestChangeDisplay" width="80%">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2"> Change Required </v-card-title>

            <v-card-text>
              {{ form.requestChange }}
            </v-card-text>

            <v-card-actions>
              <v-btn color="blue" text @click="requestChangeDisplay = false"> Ok </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="denyDialog" width="80%">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2"> Request Denied </v-card-title>

            <v-card-text> Please provide a reason for the denial of this form. </v-card-text>
            <v-card-text>
              <v-textarea v-model="form.denialReason" label="Denial Reason" rows="1" auto-grow></v-textarea>
            </v-card-text>

            <v-card-actions>
              <v-btn color="blue" text @click="denyForm()"> Submit </v-btn>
              <v-btn color="red" text @click="denyDialog = false"> Cancel </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="reassignDialog" width="80%">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2"> Reassign Form </v-card-title>

            <v-card-text> Reassign this form to a new supervisor.</v-card-text>
            <v-card-text>
              <v-combobox
                v-model="reassignEmail"
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
              <v-btn color="blue" text @click="reassignForm()"> Submit </v-btn>
              <v-btn color="red" text @click="reassignDialog = false"> Cancel </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="requestChangeDialog" width="80%">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2"> Request Change </v-card-title>

            <v-card-text> What changes need to be made to this form? </v-card-text>
            <v-card-text>
              <v-textarea v-model="form.requestChange" label="Requested Changes" rows="1" auto-grow></v-textarea>
            </v-card-text>

            <v-card-actions>
              <v-btn color="blue" text @click="requestChange()"> Submit </v-btn>
              <v-btn color="red" text @click="requestChangeDialog = false"> Cancel </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-tab-item>
      <v-tab-item><ExpenseList @reloadCost="getCostDifference" title="Estimates"/></v-tab-item>
      <v-tab-item><ExpenseList @reloadCost="getCostDifference" title="Expenses"/></v-tab-item>
      <v-tab-item>
        <TripReport> </TripReport>
      </v-tab-item>
    </v-tabs-items>
    <div class="text-center">
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate color="#f3b228" :size="70" :width="7"></v-progress-circular>
      </v-overlay>
    </div>
  </div>
</template>

<script>
import { FORM_URL, LOOKUP_URL, USERS_URL } from "@/urls";
import { secureGet, securePost } from "../../../store/jwt";
import ExpenseList from "../components/ExpenseList.vue";
import TripReport from "../components/TripReport.vue";
import stops from "../components/Stops.vue";

export default {
  name: "Form",
  components: {
    ExpenseList,
    TripReport,
    stops
  },
  async mounted() {
    this.overlay = true;
    if (this.$route.params.manage == "manage") {
      this.review = true;
    }

    this.departments = await this.getDepartmentList();

    this.$refs.form.resetValidation();

    this.getCostDifference();

    await this.getForm(this.$route.params.formId);

    if (this.form.requestChange && this.review == false && this.form.status == "Change Requested") {
      this.requestChangeDisplay = true;
    }
    this.$refs.form.resetValidation();
    this.overlay = false;
  },
  data: () => ({
    //Form
    form: {
      //personal info
      firstName: "",
      lastName: "",
      department: "",
      division: "",
      branch: "",
      unit: "",
      email: "",
      mailcode: "",
      supervisorEmail: "",
      multiStop: false,
      oneWayTrip: false,

      //stops
      stops: [
        {
          locationId: "",
          departureDate: "",
          departureTime: "",
          transport: ""
        },
        {
          locationId: "",
          departureDate: "",
          departureTime: "",
          transport: ""
        }
      ],

      //travel details
      travelDuration: "1",
      daysOffTravelStatus: "0",
      dateBackToWork: "",
      travelAdvance: 0,
      purpose: "",
      eventName: "",
      summary: "",
      benefits: "",

      //other info
      status: "",
      requestChange: "",
      denialReason: ""
    },

    report: {},
    expensesTotal: 0,
    estimatesTotal: 0,
    costDifference: 0,

    reassignEmail: "",

    //Dropdowns
    transport: ["Rental vehicle", "Personal vehicle", "Fleet vehicle", "Plane"],
    purposes: ["Maintenance", "Conference", "Workshop", "General Travel", "Community Travel"],

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

    emailSearch: "",

    dateBackToWork: "",

    departureMenu: [],
    departureTimeMenu: [],
    btwMenu: false,

    showError: null,
    snackbar: null,
    apiSuccess: "",
    overlay: true,

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
    myDepartments: function() {
      return Object.keys(this.departments);
    },
    myDivisions: function() {
      if (this.departments[this.form.department]) {
        return Object.keys(this.departments[this.form.department]);
      }
      return [];
    },
    myBranches: function() {
      if (this.departments[this.form.department] && this.departments[this.form.department][this.form.division]) {
        return Object.keys(this.departments[this.form.department][this.form.division]);
      }
      return [];
    },
    myUnits: function() {
      if (
        this.departments[this.form.department] &&
        this.departments[this.form.department][this.form.division] &&
        this.departments[this.form.department][this.form.division][this.form.branch]
      ) {
        return this.departments[this.form.department][this.form.division][this.form.branch];
      }
      return [];
    }
  },
  methods: {
    submitForm() {
      this.showError = false;
      if (this.$refs.form.validate()) {
        let formId = this.form.formId ? this.form.formId : this.$route.params.formId;

        securePost(`${FORM_URL}/${formId}/submit`, this.form).then(resp => {
          console.log(resp);
          this.apiSuccess = "Form submitted successfully";
          this.snackbar = true;
          this.requestPage();
        });
      }
    },
    saveForm() {
      console.log("Trying to save", this.form);
      this.form.status = "Draft";
      this.$refs.form.resetValidation();
      this.showError = false;
      this.form.formId = this.form.formId ? this.form.formId : this.$route.params.formId;

      securePost(`${FORM_URL}/${this.form.formId}/save`, this.form).then(resp => {
        console.log(resp);
        this.apiSuccess = "Form saved as a draft";
        this.snackbar = true;
      });
    },
    deleteForm() {
      console.log(this.form);
      console.log(this.destinations);
      // let formId = this.form.formId
      //   ? this.form.formId
      //   : this.$route.params.formId;

      // secureDelete(`${FORM_URL}/${formId}`, this.form).then((resp) => {
      //   console.log(resp);
      //   this.apiSuccess = "Form Deleted";
      //   this.snackbar = true;
      //   this.requestPage();
      // });
    },
    getCostDifference() {
      secureGet(`${FORM_URL}/${this.$route.params.formId}/costDifference`).then(resp => {
        this.expensesTotal = resp.data.expenses;
        this.estimatesTotal = resp.data.estimates;
        this.costDifference = (this.expensesTotal - this.estimatesTotal).toFixed(2);
      });
    },
    //secureGets
    async loadUser() {
      await secureGet(`${USERS_URL}/me`).then(resp => {
        this.user = resp.data.data;
        this.form.firstName = this.user.first_name[0].toUpperCase() + this.user.first_name.substring(1);
        this.form.lastName = this.user.last_name[0].toUpperCase() + this.user.last_name.substring(1);
        this.form.email = this.user.email;
        return resp.data;
      });
      await secureGet(`${USERS_URL}/unit`).then(resp => {
        this.form.department = resp.data.department;
        this.form.division = resp.data.division;
        this.form.branch = resp.data.branch;
        this.form.unit = resp.data.unit;
        this.form.mailcode = resp.data.mailcode;
        return resp.data;
      });
      return;
    },
    async loadEmails() {
      return secureGet(`${LOOKUP_URL}/emailList?email=${this.emailSearch}`).then(resp => {
        return resp.data;
      });
    },
    async getDepartmentList() {
      return secureGet(`${LOOKUP_URL}/departmentList`).then(resp => {
        return resp.data;
      });
    },
    async search() {
      if (this.emailSearch.length >= 3) {
        return secureGet(`${LOOKUP_URL}/emailList?email=${this.emailSearch}`).then(resp => {
          this.emails = resp.data;
        });
      } else {
        this.emails = [];
      }
    },

    //Helpers
    calculateDaysGone(index) {
      var Difference_In_Time =
        new Date(this.form.stops[index].departureDate).getTime() - new Date(this.form.stops[0].departureDate).getTime();

      this.form.travelDuration = (Difference_In_Time + 1000 * 3600 * 24) / (1000 * 3600 * 24);
    },
    getToday() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10);
    },
    async getForm(formId) {
      if (formId) {
        return await secureGet(`${FORM_URL}/${formId}`).then(async resp => {
          console.log("forms", resp.data);
          if (resp.data.form != "empty") {
            this.form = resp.data;
            this.form.stops.forEach((v, key) => {
              this.form.stops[key].location = this.destinations.find(entry => entry.value == v.location);
            });
          } else {
            this.form.status = "New Form";
            await this.loadUser();
            this.form.dateBackToWork = this.getToday();
            this.form.stops[0].departureDate = this.getToday();
            this.form.stops[0].departureTime = "12:00";
            this.form.stops[1].departureDate = this.getToday();
            this.form.stops[1].departureTime = "12:00";
          }
        });
      }
    },
    reassignForm() {
      let formId = this.form.formId ? this.form.formId : this.$route.params.formId;

      securePost(`${FORM_URL}/${formId}/reassign`, {
        reassign: this.reassignEmail,
        form: this.form
      }).then(resp => {
        console.log(resp);
        this.apiSuccess = "Form reassigned";
        this.snackbar = true;
      });
      this.reassignDialog = false;
      this.managePage();
    },
    denyForm() {
      let formId = this.form.formId ? this.form.formId : this.$route.params.formId;

      securePost(`${FORM_URL}/${formId}/deny`, this.form).then(resp => {
        console.log(resp);
        this.apiSuccess = "Form denied";
        this.snackbar = true;
      });
      this.denyDialog = false;
      this.managePage();
    },
    requestChange() {
      let formId = this.form.formId ? this.form.formId : this.$route.params.formId;

      securePost(`${FORM_URL}/${formId}/requestChange`, this.form).then(resp => {
        console.log(resp);
        this.apiSuccess = "Change requested";
        this.snackbar = true;
      });
      this.requestChangeDialog = false;
      this.managePage();
    },
    approveForm() {
      let formId = this.form.formId ? this.form.formId : this.$route.params.formId;

      securePost(`${FORM_URL}/${formId}/approve`, this.form).then(resp => {
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
    }
  }
};
</script>
