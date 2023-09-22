<template>
  <div>
    <h3>Purpose</h3>
    <PersonalDetailsFormCreate />

    <h3>Details</h3>
    <StopsFormCreate />

    <h3>Approvals</h3>
    <TravelDetailsForm />
  </div>
</template>

<script>
import PersonalDetailsFormCreate from "@/modules/travelForm/components/PersonalDetailsFormCreate"
import StopsFormCreate from "@/modules/travelForm/components/StopsFormCreate"
import TravelDetailsForm from "@/modules/travelForm/components/TravelDetailsForm"

export default {
  name: "DetailsTab",
  components: {
    PersonalDetailsFormCreate,
    StopsFormCreate,
    TravelDetailsForm,
  },
}
</script>
