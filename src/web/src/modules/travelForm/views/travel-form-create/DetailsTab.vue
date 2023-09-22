<template>
  <div>
    <PurposeFormCard />

    <h3>Details</h3>
    <StopsFormCreate />

    <h3>Approvals</h3>
    <TravelDetailsForm />
  </div>
</template>

<script>
import PurposeFormCard from "@/modules/travelForm/components/create/PurposeFormCard"
import StopsFormCreate from "@/modules/travelForm/components/StopsFormCreate"
import TravelDetailsForm from "@/modules/travelForm/components/TravelDetailsForm"

export default {
  name: "DetailsTab",
  components: {
    PurposeFormCard,
    StopsFormCreate,
    TravelDetailsForm,
  },
}
</script>
