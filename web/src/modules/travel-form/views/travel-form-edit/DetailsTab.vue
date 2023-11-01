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
        <ApprovalsFormCard :validate-form="validateForm" />
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <SaveDraftButton :validate-form="validateForm" />
      <v-btn
        class="ml-3"
        color="secondary"
        :to="{ name: 'TravelFormList' }"
        >Back</v-btn
      >
    </div>
  </v-form>
</template>

<script>
import PurposeFormCard from "./details-tab/PurposeFormCard"
import DetailsFormCard from "./details-tab/DetailsFormCard"
import ApprovalsFormCard from "./details-tab/ApprovalsFormCard"

import SaveDraftButton from "./details-tab/SaveDraftButton"

export default {
  name: "DetailsTab",
  components: {
    PurposeFormCard,
    DetailsFormCard,
    ApprovalsFormCard,
    SaveDraftButton,
  },
  methods: {
    validateForm() {
      if (this.$refs.form.validate()) return true

      return false
    },
  },
}
</script>
