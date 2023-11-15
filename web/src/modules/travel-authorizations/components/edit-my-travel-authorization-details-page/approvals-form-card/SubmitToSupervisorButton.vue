<template>
  <div>
    <v-btn
      v-if="hasEstimates"
      :loading="loadingCurrentForm"
      class="mt-0"
      color="primary"
      @click="submitForm"
    >
      Submit to Supervisor
    </v-btn>
    <v-tooltip
      v-else
      bottom
    >
      <template #activator="{ on, attrs }">
        <span
          v-bind="attrs"
          v-on="on"
        >
          <v-btn
            class="mt-0"
            color="secondary"
            disabled
            >Submit to Supervisor
            <v-icon
              class="ml-1"
              small
            >
              mdi-help-circle-outline
            </v-icon>
          </v-btn>
        </span>
      </template>
      <span>You need to generate an estimate before submitting.</span>
    </v-tooltip>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex"

export default {
  name: "SubmitToSupervisorButton",
  props: {
    validateForm: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapState("travelAuthorizations", ["currentTravelAuthorization", "loadingCurrentForm"]),
    ...mapGetters("travelAuthorizations", ["currentTravelAuthorizationEstimates"]),
    hasEstimates() {
      return this.currentTravelAuthorizationEstimates.length > 0
    },
    buttonColor() {
      if (this.hasEstimates) {
        return "primary"
      }

      return "secondary"
    },
  },
  methods: {
    ...mapActions("travelAuthorizations", ["updateCurrentForm"]),
    submitForm() {
      if (!this.validateForm()) {
        this.$snack("Form submission can't be sent until the form is complete.", { color: "error" })
        return
      }

      this.currentTravelAuthorization.status = "submitted"
      return this.updateCurrentForm()
        .then(() => {
          this.$router.push({
            name: "ReadMyTravelAuthorizationDetailsPage",
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
