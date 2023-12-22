<template>
  <div>
    <v-btn
      v-if="hasEstimates"
      :loading="isLoading"
      class="mt-0"
      color="primary"
      @click="saveWrapper"
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
import { mapActions, mapGetters, mapMutations } from "vuex"

import { STATUSES } from "@/api/travel-authorizations-api"

export default {
  name: "SubmitToSupervisorButton",
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
    validateForm: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters("travelAuthorization", ["estimates", "isLoading"]),
    hasEstimates() {
      return this.estimates.length > 0
    },
    buttonColor() {
      if (this.hasEstimates) {
        return "primary"
      }

      return "secondary"
    },
  },
  async mounted() {
    await this.ensure(this.travelAuthorizationId)
  },
  methods: {
    ...mapActions("travelAuthorization", ["ensure", "save"]),
    // TODO: move this to a back-end state change endpoint
    ...mapMutations("travelAuthorization", ["SET_STATUS"]),
    saveWrapper() {
      if (!this.validateForm()) {
        this.$snack("Form submission can't be sent until the form is complete.", { color: "error" })
        return
      }

      this.SET_STATUS(STATUSES.SUBMITTED)
      return this.save()
        .then(() => {
          this.$router.push({
            name: "ReadMyTravelAuthorizationDetailsPage",
            params: { travelAuthorizationId: this.travelAuthorization },
          })
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
    },
  },
}
</script>
