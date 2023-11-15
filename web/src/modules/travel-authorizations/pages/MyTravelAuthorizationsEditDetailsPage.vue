<template>
  <v-form
    ref="form"
    class="mt-4"
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
        :to="{ name: 'MyTravelAuthorizationsPage' }"
        >Back</v-btn
      >
    </div>
  </v-form>
</template>

<script>
import PurposeFormCard from "@/modules/travel-authorizations/components/my-travel-authorizations-edit-details-page/PurposeFormCard"
import DetailsFormCard from "@/modules/travel-authorizations/components/my-travel-authorizations-edit-details-page/DetailsFormCard"
import ApprovalsFormCard from "@/modules/travel-authorizations/components/my-travel-authorizations-edit-details-page/ApprovalsFormCard"

import SaveDraftButton from "@/modules/travel-authorizations/components/my-travel-authorizations-edit-details-page/SaveDraftButton"

export default {
  name: "MyTravelAuthorizationsEditDetailsPage",
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
