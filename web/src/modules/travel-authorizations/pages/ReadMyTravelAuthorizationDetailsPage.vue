<template>
  <div class="mt-4">
    <v-row>
      <v-col>
        <PurposeCard :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DetailsCard :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ApprovalsCard :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <v-btn
        class="ml-3"
        color="secondary"
        :to="{ name: 'MyTravelAuthorizationsPage' }"
        >Back</v-btn
      >
    </div>
  </div>
</template>

<script>
import PurposeCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/PurposeCard"
import DetailsCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/DetailsCard"
import ApprovalsCard from "@/modules/travel-authorizations/components/read-travel-authorization-details-page/ApprovalsCard"

export default {
  name: "ReadMyTravelAuthorizationDetailsPage",
  components: {
    PurposeCard,
    DetailsCard,
    ApprovalsCard,
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
}
</script>
