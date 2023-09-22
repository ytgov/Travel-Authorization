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
import PurposeFormCard from "@/modules/travelForm/components/create/PurposeFormCard"
import DetailsFormCard from "@/modules/travelForm/components/create/DetailsFormCard"
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
