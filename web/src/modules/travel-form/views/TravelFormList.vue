<template>
  <div>
    <div class="d-flex justify-space-between align-baseline my-5">
      <h1>My Travel</h1>
      <v-btn
        :disabled="loadingCreatingForm"
        :loading="loadingCreatingForm"
        color="primary"
        @click="createAndGoToFormDetails"
      >
        + Travel Authorization
      </v-btn>
    </div>

    <MyTravelAuthorizationsTable />
  </div>
</template>
<script>
import MyTravelAuthorizationsTable from "@/modules/travel-form/components/MyTravelAuthorizationsTable"

export default {
  name: "TravelFormList",
  components: {
    MyTravelAuthorizationsTable,
  },
  data: () => ({
    loadingCreatingForm: false,
  }),
  mounted() {},
  computed: {},
  methods: {
    goToFormDetails(form) {
      const formId = form.id
      this.$router.push({ name: "TravelFormEdit-DetailsTab", params: { formId } })
    },
    createAndGoToFormDetails() {
      this.loadingCreatingForm = true
      return this.create({ status: "Draft" })
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
  watch: {},
}
</script>
