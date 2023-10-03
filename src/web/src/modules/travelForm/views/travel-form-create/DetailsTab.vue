<template>
  <div class="mt-4">
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
        <ApprovalsFormCard />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PurposeFormCard from "./details-tab/PurposeFormCard"
import DetailsFormCard from "./details-tab/DetailsFormCard"
import ApprovalsFormCard from "./details-tab/ApprovalsFormCard"

export default {
  name: "DetailsTab",
  components: {
    PurposeFormCard,
    DetailsFormCard,
    ApprovalsFormCard,
  },
}
</script>
