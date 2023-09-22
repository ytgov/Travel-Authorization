<template>
  <div>
    <PurposeFormCardCreate />

    <h3>Details</h3>
    <StopsFormCreate />

    <h3>Approvals</h3>
    <TravelDetailsForm />
  </div>
</template>

<script>
import PurposeFormCardCreate from "@/modules/travelForm/components/PurposeFormCardCreate"
import StopsFormCreate from "@/modules/travelForm/components/StopsFormCreate"
import TravelDetailsForm from "@/modules/travelForm/components/TravelDetailsForm"

export default {
  name: "DetailsTab",
  components: {
    PurposeFormCardCreate,
    StopsFormCreate,
    TravelDetailsForm,
  },
}
</script>
