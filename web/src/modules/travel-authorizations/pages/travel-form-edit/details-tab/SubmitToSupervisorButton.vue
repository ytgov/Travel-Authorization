<template>
  <v-btn
    :loading="loadingCurrentForm"
    color="primary"
    @click="submitForm"
  >
    Submit to Supervisor
  </v-btn>
</template>

<script>
import { mapActions, mapState } from "vuex"

export default {
  name: "SubmitToSupervisorButton",
  props: {
    validateForm: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapState("travelForm", ["currentTravelAuthorization", "loadingCurrentForm"]),
  },
  methods: {
    ...mapActions("travelForm", ["updateCurrentForm"]),
    submitForm() {
      if (!this.validateForm()) {
        this.$snack("Form submission can't be sent until the form is complete.", { color: "error" })
        return
      }

      this.currentTravelAuthorization.status = "submitted"
      return this.updateCurrentForm()
        .then(() => {
          this.$router.push({
            name: "TravelAuthorizationRead-DetailsTab",
            params: { formId: this.currentTravelAuthorization.id },
          })
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
    },
  },
}
</script>
