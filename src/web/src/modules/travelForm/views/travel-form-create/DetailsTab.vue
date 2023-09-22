<template>
  <div>
    <h3>Purpose</h3>
    <PersonalDetailsForm />

    <h3>Details</h3>
    <StopsForm />

    <h3>Approvals</h3>
    <TravelDetailsForm />
  </div>
</template>

<script>
import PersonalDetailsForm from "@/modules/travelForm/components/PersonalDetailsForm"
import StopsForm from "@/modules/travelForm/components/StopsForm"
import TravelDetailsForm from "@/modules/travelForm/components/TravelDetailsForm"

export default {
  name: "DetailsTab",
  components: {
    PersonalDetailsForm,
    StopsForm,
    TravelDetailsForm,
  },
}
</script>
