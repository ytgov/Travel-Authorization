<template>
  <v-form
    ref="form"
    class="mt-4"
    lazy-validation
  >
    <v-row>
      <v-col>
        <PurposeCard />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DetailsCard />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ApprovalsCard :validate-form="validateForm" />
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
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
import PurposeCard from "@/modules/travel-authorizations/components/manage-travel-authorization-details-page/PurposeCard"
import DetailsCard from "@/modules/travel-authorizations/components/manage-travel-authorization-details-page/DetailsCard"
import ApprovalsCard from "@/modules/travel-authorizations/components/manage-travel-authorization-details-page/ApprovalsCard"

export default {
  name: "ManageTravelAuthorizationDetailsPage",
  components: {
    PurposeCard,
    DetailsCard,
    ApprovalsCard,
  },
  methods: {
    validateForm() {
      if (this.$refs.form.validate()) return true

      return false
    },
  },
}
</script>
