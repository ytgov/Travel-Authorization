<template>
  <div class="mt-4">
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
        <ApprovalsCard />
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
import PurposeCard from "@/modules/travel-authorizations/components/my-travel-authorization-read-details-page/PurposeCard"
import DetailsCard from "@/modules/travel-authorizations/components/my-travel-authorization-read-details-page/DetailsCard"
import ApprovalsCard from "@/modules/travel-authorizations/components/my-travel-authorization-read-details-page/ApprovalsCard"

export default {
  name: "MyTravelAuthorizationReadDetailsPage",
  components: {
    PurposeCard,
    DetailsCard,
    ApprovalsCard,
  },
}
</script>
