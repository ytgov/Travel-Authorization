<template>
  <v-btn
    :loading="isLoading"
    color="green"
    @click="saveWrapper"
    >Save Draft
  </v-btn>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex"

import { STATUSES } from "@/api/travel-authorizations-api"

export default {
  name: "SaveDraftButton",
  props: {
    validateForm: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters("current/travelAuthorization", ["isLoading"]),
  },
  methods: {
    ...mapActions("current/travelAuthorization", ["save"]),
    // TODO: move this to a back-end state change endpoint
    ...mapMutations("current/travelAuthorization", ["SET_STATUS"]),
    saveWrapper() {
      if (!this.validateForm()) {
        this.$snack("Form submission can't be sent until the form is complete.", { color: "error" })
        return
      }

      this.SET_STATUS(STATUSES.DRAFT)
      return this.save()
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
