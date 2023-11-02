<template>
  <v-btn
    :loading="loadingCurrentForm"
    color="green"
    @click="saveForm"
    >Save Draft
  </v-btn>
</template>

<script>
import { mapActions, mapState } from "vuex"

export default {
  name: "SaveDraftButton",
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
    saveForm() {
      if (!this.validateForm()) {
        this.$snack("Form submission can't be sent until the form is complete.", { color: "error" })
        return
      }

      this.currentTravelAuthorization.status = "draft"
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
