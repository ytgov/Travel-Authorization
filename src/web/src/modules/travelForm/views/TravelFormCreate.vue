<template>
  <div>
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        color="#f3b228"
        :size="70"
        :width="7"
        class="text-center"
      ></v-progress-circular>
    </v-overlay>

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

    <v-tabs>
      <v-tab :to="{ name: 'TravelFormCreate-DetailsTab' }">Details</v-tab>
      <v-tab>Estimates</v-tab>
      <v-tab>Expenses</v-tab>
      <v-tab>Trip Report</v-tab>
    </v-tabs>
    <v-form
      ref="form"
      lazy-validation
    >
      <template v-if="!loading">
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

export default {
  name: "TravelFormCreate",
  components: {
    Breadcrumbs,
  },
  data() {
    return {
      loading: false,
      showSnackbar: false,
      snackbarMessage: "",
      snackbarStatus: "info",
    }
  },
  computed: {
    ...mapState("travelForm", ["request"]),
  },
  async mounted() {
    this.loading = true
    await this.initializeForm().finally(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions("travelForm", ["initializeForm", "create"]),
    submitForm() {
      if (!this.$refs.form.validate()) {
        this.snackbarStatus = "error"
        this.snackbarMessage = "Form submission can't be sent until the form is complete."
        this.showSnackbar = true
        return
      }

      this.request.status = "Submitted"
      return this.create(this.request).catch((error) => {
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
      return this.create(this.request).catch((error) => {
        this.snackbarStatus = "error"
        this.snackbarMessage = error.response.message
        this.showSnackbar = true
      })
    },
  },
}
</script>
