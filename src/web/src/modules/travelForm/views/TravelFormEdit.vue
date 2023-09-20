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
            <h1>Travel Authorization Request</h1>

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
                <personal-details-form
                  :form="form"
                  :review="review"
                  :continue="
                    () => {
                      stepVal = 2
                    }
                  "
                ></personal-details-form>
              </v-stepper-content>

              <v-stepper-step
                :complete="stepVal > 2"
                step="2"
              >
                Tell us about the travel
              </v-stepper-step>

              <v-stepper-content step="2">
                <stops-form
                  :form="form"
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
                ></stops-form>
              </v-stepper-content>

              <v-stepper-step
                :complete="stepVal > 3"
                step="3"
              >
                Enter details about the trip and purpose
              </v-stepper-step>

              <v-stepper-content step="3">
                <travel-details-form
                  :form="form"
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
            :to="{ name: 'travelRequestsList' }"
            >Back</v-btn
          >
        </div>
        <v-snackbar
          v-model="snackbar"
          right
          color="success"
        >
          <v-icon class="mr-3">mdi-thumb-up-outline</v-icon>
          {{ apiSuccess }}
        </v-snackbar>
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
import { mapActions, mapState } from "vuex"

import { FORM_URL, USERS_URL } from "@/urls"
import { secureGet, securePost } from "@/store/jwt"
import ExpenseList from "../components/ExpenseList.vue"
import TripReport from "../components/TripReport.vue"

import PersonalDetailsForm from "../components/PersonalDetailsForm.vue"
import StopsForm from "../components/StopsForm.vue"
import TravelDetailsForm from "../components/TravelDetailsForm.vue"

import formsApi from "@/apis/forms-api"

export default {
  name: "TravelFormCreate",
  components: {
    ExpenseList,
    TripReport,
    PersonalDetailsForm,
    StopsForm,
    TravelDetailsForm,
  },
  data: () => ({
    //Form
    form: {},
    stepVal: 1,

    expensesTotal: 0,
    estimatesTotal: 0,
    costDifference: 0,

    //Form functionality variables
    tab: null,
    review: false,

    showError: null,
    snackbar: null,
    apiSuccess: "",
    loading: true,
  }),
  async mounted() {
    this.loading = true
    const formId = this.$route.params.formId
    await this.loadForm(formId)
    await this.loadUser()
    this.$refs.form.resetValidation()

    this.loading = false
  },
  computed: {
    ...mapState("travelForm", ["request"]),
  },
  methods: {
    ...mapActions("travelForm", ["loadForm"]),
    submitForm() {
      this.showError = false
      if (this.$refs.form.validate()) {
        return formsApi.create(this.request).then(({ form }) => {
          console.log("data:", form)
          this.$set(this, "form", form)
          this.apiSuccess = "Form submitted successfully"
          this.snackbar = true
          this.$router.push({ name: "travelRequestsList" })
        })
      }
    },
    saveForm() {
      console.log("Trying to save", this.form)
      this.request.status = "Draft"
      this.$refs.form.resetValidation()
      this.showError = false
      this.request.formId = this.request.formId ? this.request.formId : this.$route.params.formId

      securePost(`${FORM_URL}/${this.request.formId}/save`, this.form).then((resp) => {
        console.log(resp)
        this.apiSuccess = "Form saved as a draft"
        this.snackbar = true
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
      await secureGet(`${USERS_URL}/me`).then(({ data }) => {
        this.user = data.data
        this.request.firstName =
          this.user.first_name[0].toUpperCase() + this.user.first_name.substring(1)
        this.request.lastName =
          this.user.last_name[0].toUpperCase() + this.user.last_name.substring(1)
        this.request.email = this.user.email
        return this.user
      })
      await secureGet(`${USERS_URL}/unit`).then(({ data }) => {
        this.request.department = data.department
        this.request.division = data.division
        this.request.branch = data.branch
        this.request.unit = data.unit
        this.request.mailcode = data.mailcode
        return data
      })
      return this.user
    },
  },
}
</script>
