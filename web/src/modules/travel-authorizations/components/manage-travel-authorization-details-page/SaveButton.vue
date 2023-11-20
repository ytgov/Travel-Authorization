<template>
  <v-btn
    :loading="isLoading"
    color="green"
    @click="saveWrapper"
    >Save
  </v-btn>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "SaveButton",
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
    saveWrapper() {
      if (!this.validateForm()) {
        this.$snack("Form submission can't be sent until the form is complete.", { color: "error" })
        return
      }

      return this.save()
        .then(() => {
          this.$snack("Form saved.", { color: "success" })
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
    },
  },
}
</script>
