<template>
  <div>
    <v-overlay :value="loadingForm">
      <v-progress-circular
        indeterminate
        color="#f3b228"
        :size="70"
        :width="7"
        class="text-center"
      ></v-progress-circular>
    </v-overlay>

    <Breadcrumbs />

    <h1>
      Travel -
      <v-progress-circular
        v-if="loadingUser"
        indeterminate
      ></v-progress-circular>
      <template v-else> {{ currentUser.firstName }} {{ currentUser.lastName }} </template>
    </h1>

    <template v-if="!loadingForm">
      <SummaryHeaderForm />
    </template>

    <v-tabs v-model="tab">
      <v-tab :to="{ name: 'TravelFormEdit-DetailsTab' }">Details</v-tab>
      <v-tab
        :to="{ name: 'TravelFormEdit-EstimateTab' }"
        @click="resetActiveState"
        >Estimate</v-tab
      >
      <v-tab>Request - TODO</v-tab>
      <v-tab>Itinerary - TODO</v-tab>
      <v-tab>Expense - TODO</v-tab>
      <v-tab>Reporting - TODO</v-tab>
    </v-tabs>
    <v-form
      ref="form"
      lazy-validation
    >
      <template v-if="!loadingForm">
        <router-view></router-view>
      </template>
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
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"

import Breadcrumbs from "@/components/Breadcrumbs"
import SummaryHeaderForm from "./travel-form-edit/SummaryHeaderForm"

export default {
  name: "TravelFormEdit",
  components: {
    Breadcrumbs,
    SummaryHeaderForm,
  },
  props: {
    formId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    loadingForm: true,
    loadingUser: false,
    tab: null,
  }),
  computed: {
    ...mapState("travelForm", ["request", "currentUser"]),
    formIdAsNumber() {
      return parseInt(this.formId)
    },
  },
  async mounted() {
    this.loadingForm = true
    this.loadingUser = true
    return Promise.all([
      this.loadForm(this.formId).finally(() => {
        this.loadingForm = false
      }),
      this.loadUser().finally(() => {
        this.loadingUser = false
      }),
    ])
  },
  methods: {
    ...mapActions("travelForm", ["loadForm", "create", "loadUser"]),
    submitForm() {
      if (!this.$refs.form.validate()) {
        this.$snack("Form submission can't be sent until the form is complete.", { color: "error" })
        return
      }

      this.loadingForm = true
      this.request.status = "Submitted"
      return this.create(this.request)
        .then(() => {
          this.$router.push({ name: "TravelFormList" })
        })
        .catch((error) => {
          this.$snack(error.response.message, { color: "error" })
        })
        .finally(() => {
          this.loadingForm = false
        })
    },
    saveForm() {
      if (!this.$refs.form.validate()) {
        this.$snack("Form submission can't be sent until the form is complete.", { color: "error" })
        return
      }

      this.loadingForm = true
      this.request.status = "Draft"
      return this.create(this.request)
        .then(() => {
          this.$router.push({ name: "TravelFormList" })
        })
        .catch((error) => {
          this.$snack(error.response.message, { color: "error" })
        })
        .finally(() => {
          this.loadingForm = false
        })
    },
    // This will be unnecessary once all tabs are router links
    // This fixes a bug where the active state of the tabs is not reset, because url is not changed
    resetActiveState() {
      this.tab = this.$route.path
    },
  },
}
</script>
