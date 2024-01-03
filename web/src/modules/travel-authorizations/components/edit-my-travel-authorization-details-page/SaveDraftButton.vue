<template>
  <v-btn
    :loading="isLoading"
    color="green"
    @click="saveWrapper"
    >Save Draft
  </v-btn>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "SaveDraftButton",
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
    ...mapGetters("travelAuthorization", ["isLoading"]),
  },
  async mounted() {
    await this.ensure(this.travelAuthorizationId)
  },
  methods: {
    ...mapActions("travelAuthorization", ["ensure", "save"]),
    saveWrapper() {
      if (!this.validateForm()) {
        this.$snack("Form submission can't be sent until the form is complete.", { color: "error" })
        return
      }

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
