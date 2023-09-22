<template>
  <div>
    <PurposeFormCard />

    <h3>Details</h3>
    <DetailsFormCard />

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
