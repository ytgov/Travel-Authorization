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
        :to="{ name: 'TravelFormList' }"
        >Back</v-btn
      >
    </div>
  </div>
</template>

<script>
import PurposeCard from "./details-tab/PurposeCard"
import DetailsCard from "./details-tab/DetailsCard"
import ApprovalsCard from "./details-tab/ApprovalsCard"

export default {
  name: "DetailsTab",
  components: {
    PurposeCard,
    DetailsCard,
    ApprovalsCard,
  },
}
</script>
