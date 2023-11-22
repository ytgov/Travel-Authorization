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
    <v-row>
      <v-col>
        <ManagementCard :travel-authorization-id="travelAuthorizationId" />
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
import ApprovalsCard from "@/modules/travel-authorizations/components/manage-travel-authorization-details-page/ApprovalsCard"
import DetailsCard from "@/modules/travel-authorizations/components/manage-travel-authorization-details-page/DetailsCard"
import ManagementCard from "@/modules/travel-authorizations/components/manage-travel-authorization-details-page/ManagementCard"
import PurposeCard from "@/modules/travel-authorizations/components/manage-travel-authorization-details-page/PurposeCard"

export default {
  name: "ManageTravelAuthorizationDetailsPage",
  components: {
    ApprovalsCard,
    DetailsCard,
    ManagementCard,
    PurposeCard,
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    validateForm() {
      if (this.$refs.form.validate()) return true

      return false
    },
  },
}
</script>
