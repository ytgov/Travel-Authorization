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

    <h3>Approvals</h3>
    <TravelDetailsForm />
  </div>
</template>

<script>
import PurposeFormCard from "./details-tab/PurposeFormCard"
import DetailsFormCard from "./details-tab/DetailsFormCard"
import TravelDetailsForm from "@/modules/travelForm/components/TravelDetailsForm"

export default {
  name: "DetailsTab",
  components: {
    PurposeFormCard,
    DetailsFormCard,
    TravelDetailsForm,
  },
}
</script>
