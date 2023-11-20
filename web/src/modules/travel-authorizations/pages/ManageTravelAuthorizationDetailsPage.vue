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
      <SaveButton :validate-form="validateForm" />
      <v-btn
        class="ml-3"
        color="secondary"
        :to="{ name: 'ManageTravelAuthorizationsPage' }"
        >Back</v-btn
      >
    </div>
  </v-form>
</template>

<script>
import PurposeFormCard from "@/modules/travel-authorizations/components/manage-travel-authorization-details-page/PurposeFormCard"
import DetailsFormCard from "@/modules/travel-authorizations/components/manage-travel-authorization-details-page/DetailsFormCard"
import ApprovalsFormCard from "@/modules/travel-authorizations/components/manage-travel-authorization-details-page/ApprovalsFormCard"

import SaveButton from "@/modules/travel-authorizations/components/manage-travel-authorization-details-page/SaveButton"

export default {
  name: "ManageTravelAuthorizationDetailsPage",
  components: {
    PurposeFormCard,
    DetailsFormCard,
    ApprovalsFormCard,
    SaveButton,
  },
  methods: {
    validateForm() {
      if (this.$refs.form.validate()) return true

      return false
    },
  },
}
</script>
