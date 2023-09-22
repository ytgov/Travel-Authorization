<template>
  <div>
    <div class="text-center">
      <v-overlay :value="loading">
        <v-progress-circular
          indeterminate
          color="#f3b228"
          :size="70"
          :width="7"
        ></v-progress-circular>
      </v-overlay>
    </div>

    <Breadcrumbs />

    <!-- TODO: make this top level component or plugin -->
    <v-snackbar
      v-model="showSnackbar"
      right
      :color="snackbarStatus"
      :timeout="2000"
    >
      <v-icon class="mr-3">mdi-thumb-up-outline</v-icon>
      {{ snackbarMessage }}
    </v-snackbar>

    <v-tabs v-model="tab">
      <v-tab>Travel Form </v-tab>
      <v-tab>Estimates</v-tab>
      <v-tab>Expenses</v-tab>
      <v-tab>Trip Report</v-tab>
    </v-tabs>
    <br />
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-form
          ref="form"
          lazy-validation
        >
          <template v-if="!loading">
            <h1>
              Travel Authorization Request
              <v-chip
                class="ml-2"
                color="green"
                text-color="white"
              >
                {{ request.status }}
              </v-chip>
            </h1>

            <p>
              To submit a travel authorization request, you must first complete the following 3
              steps:
            </p>

            <v-stepper
              v-model="stepVal"
              vertical
            >
              <v-stepper-step
                :complete="stepVal > 1"
                step="1"
              >
                Enter your personal details
              </v-stepper-step>

              <v-stepper-content step="1">
                <PersonalDetailsFormEdit
                  :review="review"
                  :continue="
                    () => {
                      stepVal = 2
                    }
                  "
                ></PersonalDetailsFormEdit>
              </v-stepper-content>

              <v-stepper-step
                :complete="stepVal > 2"
                step="2"
              >
                Tell us about the travel
              </v-stepper-step>

              <v-stepper-content step="2">
                <StopsFormEdit
                  :form-id="formIdAsNumber"
                  :review="review"
                  :continue="
                    () => {
                      stepVal = 3
                    }
                  "
                  :back="
                    () => {
                      stepVal = 1
                    }
                  "
                ></StopsFormEdit>
              </v-stepper-content>

              <v-stepper-step
                :complete="stepVal > 3"
                step="3"
              >
                Enter details about the trip and purpose
              </v-stepper-step>

              <v-stepper-content step="3">
                <travel-details-form
                  :review="review"
                  :continue="
                    () => {
                      stepVal = 1
                    }
                  "
                  continue-title="Review"
                  :back="
                    () => {
                      stepVal = 2
                    }
                  "
                ></travel-details-form>
              </v-stepper-content>
            </v-stepper>
          </template>
        </v-form>
        <div>
          <v-btn
            color="blue"
            class="mr-5"
            @click="submitForm"
          >
            Submit to Supervisor
          </v-btn>
          <v-btn
            color="green"
            class="mr-5"
            @click="saveForm"
            >Save Draft
          </v-btn>
          <v-btn
            color="secondary"
            :to="{ name: 'TravelFormList' }"
            >Back</v-btn
          >
        </div>
      </v-tab-item>
      <v-tab-item>
        <ExpenseList
          @reloadCost="getCostDifference"
          title="Estimates"
        />
      </v-tab-item>
      <v-tab-item>
        <ExpenseList
          @reloadCost="getCostDifference"
          title="Expenses"
        />
      </v-tab-item>
      <v-tab-item>
        <TripReport> </TripReport>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { upperFirst, isEmpty } from "lodash"
import { mapActions, mapState } from "vuex"

import { FORM_URL, USERS_URL } from "@/urls"
import { secureGet } from "@/store/jwt"
import formsApi from "@/apis/forms-api"

import Breadcrumbs from "@/components/Breadcrumbs"
import ExpenseList from "../components/ExpenseList"
import TripReport from "../components/TripReport"

import PersonalDetailsFormEdit from "../components/PersonalDetailsFormEdit"
import StopsFormEdit from "../components/StopsFormEdit"
import TravelDetailsForm from "../components/TravelDetailsForm"

export default {
  name: "TravelFormEdit",
  components: {
    Breadcrumbs,
    ExpenseList,
    PersonalDetailsFormEdit,
    StopsFormEdit,
    TravelDetailsForm,
    TripReport,
  },
  props: {
    formId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    stepVal: 1,

    expensesTotal: 0,
    estimatesTotal: 0,
    costDifference: 0,

    //Form functionality variables
    tab: null,
    review: false,

    showSnackbar: false,
    snackbarMessage: "",
    snackbarStatus: "info",
    loading: true,
  }),
  async mounted() {
    this.loading = true
    await this.loadForm(this.formId)
    await this.loadUser()
    this.$refs.form.resetValidation()

    this.loading = false
  },
  computed: {
    ...mapState("travelForm", ["request"]),
    formIdAsNumber() {
      return parseInt(this.formId)
    },
  },
  methods: {
    ...mapActions("travelForm", ["loadForm"]),
    submitForm() {
      if (!this.$refs.form.validate()) {
        this.snackbarStatus = "error"
        this.snackbarMessage = "Form submission can't be sent until the form is complete."
        this.showSnackbar = true
        return
      }

      this.request.status = "Submitted"
      return formsApi
        .update(this.formId, this.request)
        .then(({ form }) => {
          this.snackbarStatus = "success"
          this.snackbarMessage = "Form submitted successfully"
          this.showSnackbar = true
          this.$router.push({ name: "TravelFormList" })
          return form
        })
        .catch((error) => {
          this.snackbarStatus = "error"
          this.snackbarMessage = error.response.message
          this.showSnackbar = true
        })
    },
    saveForm() {
      if (!this.$refs.form.validate()) {
        this.snackbarStatus = "error"
        this.snackbarMessage = "Form submission can't be sent until the form is complete."
        this.showSnackbar = true
        return
      }

      this.request.status = "Draft"
      return formsApi
        .update(this.formId, this.request)
        .then(({ form }) => {
          this.snackbarStatus = "success"
          this.snackbarMessage = "Form saved as a draft"
          this.showSnackbar = true
          this.$router.push({ name: "TravelFormList" })
          return form
        })
        .catch((error) => {
          this.snackbarStatus = "error"
          this.snackbarMessage = error.response.message
          this.showSnackbar = true
        })
    },
    getCostDifference() {
      secureGet(`${FORM_URL}/${this.$route.params.formId}/costDifference`).then((resp) => {
        this.expensesTotal = resp.data.expenses
        this.estimatesTotal = resp.data.estimates
        this.costDifference = (this.expensesTotal - this.estimatesTotal).toFixed(2)
      })
    },
    async loadUser() {
      if (
        isEmpty(this.request.firstName) &&
        isEmpty(this.request.lastName) &&
        isEmpty(this.request.email)
      ) {
        await secureGet(`${USERS_URL}/me`).then(({ data }) => {
          const user = data.data
          this.request.firstName = upperFirst(user.first_name)
          this.request.lastName = upperFirst(user.last_name)
          this.request.email = user.email
        })
      }

      if (isEmpty(this.request.department) && isEmpty(this.request.mailcode)) {
        await secureGet(`${USERS_URL}/unit`).then(({ data }) => {
          this.request.department = data.department
          this.request.division = data.division
          this.request.branch = data.branch
          this.request.unit = data.unit
          this.request.mailcode = data.mailcode
        })
      }
    },
  },
}
</script>
