<template>
  <div>
    <h3>Purpose</h3>
    <personal-details-form></personal-details-form>

    <h3>Details</h3>
    <stops-form></stops-form>

    <h3>Approvals</h3>
    <travel-details-form></travel-details-form>
  </div>
</template>

<script>
import PersonalDetailsForm from "@/modules/travelForm/components/PersonalDetailsForm.vue"
import StopsForm from "@/modules/travelForm/components/StopsForm.vue"
import TravelDetailsForm from "@/modules/travelForm/components/TravelDetailsForm.vue"

export default {
  name: "DetailsTab",
  components: {
    PersonalDetailsForm,
    StopsForm,
    TravelDetailsForm,
  },
}
</script>
