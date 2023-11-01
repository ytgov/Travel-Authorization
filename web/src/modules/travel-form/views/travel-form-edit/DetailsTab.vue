<template>
  <v-form
    class="mt-4"
    ref="form"
    lazy-validation
  >
    <v-row>
      <v-col>
        <PurposeFormCard />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DetailsFormCard />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ApprovalsFormCard />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-btn
          color="blue"
          @click="submitForm"
        >
          Submit to Supervisor
        </v-btn>
        <v-btn
          color="green"
          class="ml-5"
          @click="saveForm"
          >Save Draft
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapActions, mapState } from "vuex"

import PurposeFormCard from "./details-tab/PurposeFormCard"
import DetailsFormCard from "./details-tab/DetailsFormCard"
import ApprovalsFormCard from "./details-tab/ApprovalsFormCard"

export default {
  name: "DetailsTab",
  components: {
    PurposeFormCard,
    DetailsFormCard,
    ApprovalsFormCard,
  },
  computed: {
    ...mapState("travelForm", ["currentForm"]),
  },
  methods: {
    ...mapActions("travelForm", ["updateCurrentForm"]),
    submitForm() {
      if (!this.$refs.form.validate()) {
        this.$snack("Form submission can't be sent until the form is complete.", { color: "error" })
        return
      }

      this.currentForm.status = "submitted"
      return this.updateCurrentForm()
        .then(() => {
          this.$router.push({ name: "TravelFormList" })
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
    },
    saveForm() {
      if (!this.$refs.form.validate()) {
        this.$snack("Form submission can't be sent until the form is complete.", { color: "error" })
        return
      }

      this.currentForm.status = "draft"
      return this.updateCurrentForm()
        .then(() => {
          this.$snack("Form saved as a draft", { color: "success" })
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
    },
  },
}
</script>
