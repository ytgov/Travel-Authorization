<template>
  <v-btn
    :disabled="loadingCreatingForm"
    :loading="loadingCreatingForm"
    color="primary"
    @click="createAndGoToFormDetails"
  >
    + Travel Authorization
  </v-btn>
</template>
<script>
import { mapActions } from "vuex"

export default {
  name: "CreateTravelAuthorizationButton",
  data: () => ({
    loadingCreatingForm: false,
  }),
  methods: {
    ...mapActions("travelAuthorizations", ["create"]),
    goToFormDetails(form) {
      const formId = form.id
      this.$router.push({ name: "TravelAuthorizationEdit-DetailsTab", params: { formId } })
    },
    createAndGoToFormDetails() {
      this.loadingCreatingForm = true
      return this.create({ status: "draft" })
        .then((form) => {
          return this.goToFormDetails(form)
        })
        .catch((error) => {
          this.$snack(error.message, { color: "error" })
        })
        .finally(() => {
          this.loadingCreatingForm = false
        })
    },
  },
}
</script>
