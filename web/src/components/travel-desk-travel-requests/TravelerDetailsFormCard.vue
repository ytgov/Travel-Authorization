<template>
  <TitleCard
    class="mt-10"
    title-width="11rem"
    large-title
  >
    <template #title>
      <div>Traveler Details</div>
    </template>
    <template #body>
      <v-form ref="form">
        <v-row class="mt-5 mx-3">
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.legalFirstName"
              label="Legal First Name *"
              :rules="[required]"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.legalMiddleName"
              label="Legal Middle Name"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.legalLastName"
              label="Legal Last Name *"
              :rules="[required]"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.birthDate"
              label="Birth Date"
              outlined
              :max="dobMaxDate"
              type="date"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelAuthorizationId"
              readonly
              label="Travel Auth"
              outlined
            />
          </v-col>
        </v-row>
        <v-row class="mt-0 mx-3">
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.strAddress"
              label="Address *"
              :rules="[required]"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <LocationsAutocomplete
              v-model="travelerDetails.city"
              label="City *"
              item-value="city"
              :rules="[required]"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.province"
              label="Province *"
              :rules="[required]"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.postalCode"
              label="Postal Code *"
              :rules="[required]"
              outlined
            />
          </v-col>
          <v-col
            v-if="!travelerDetails.internationalTravel"
            cols="2"
          >
            <v-checkbox
              v-model="travelerDetails.internationalTravel"
              label="International travel"
            />
          </v-col>
          <v-col
            v-if="travelerDetails.internationalTravel"
            cols="2"
          >
            <v-text-field
              v-model="travelerDetails.passportNum"
              label="Passport Number"
              outlined
            />
          </v-col>
          <v-col
            v-if="travelerDetails.internationalTravel"
            cols="2"
          >
            <v-text-field
              v-model="travelerDetails.passportCountry"
              label="Passport Country"
              outlined
            />
          </v-col>
        </v-row>

        <v-row class="mt-0 mx-3">
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.busPhone"
              :rules="[isPhoneNumber, required]"
              label="Business Phone *"
              outlined
              validate-on-blur
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.busEmail"
              :rules="[isEmail, required]"
              label="Business Email *"
              outlined
              validate-on-blur
            />
          </v-col>
          <v-col cols="3">
            <v-checkbox
              v-model="travelerDetails.travelContact"
              label="Contact information different for travel"
            />
          </v-col>
          <v-col
            v-if="travelerDetails.travelContact"
            cols="2"
          >
            <v-text-field
              v-model="travelerDetails.travelPhone"
              :rules="[isPhoneNumber]"
              label="Travel Phone"
              outlined
            />
          </v-col>
          <v-col
            v-if="travelerDetails.travelContact"
            cols="3"
          >
            <v-text-field
              v-model="travelerDetails.travelEmail"
              :rules="[isEmail]"
              label="Travel Email"
              outlined
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </TitleCard>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue"
import { cloneDeep, isNil } from "lodash"

import { isPhoneNumber, isEmail } from "@/utils/validators"

import LocationsAutocomplete from "@/components/locations/LocationsAutocomplete.vue"
import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"
import { required } from "@/utils/validators"

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(["input"])

const travelerDetails = reactive({
  legalFirstName: "",
  legalMiddleName: "",
  legalLastName: "",
  birthDate: "",
  strAddress: "",
  city: "",
  province: "",
  postalCode: "",
  passportNum: "",
  passportCountry: "",
  busPhone: "",
  busEmail: "",
  travelContact: "",
  travelPhone: "",
  travelEmail: "",
  // internationalTravel = this.modelValue.passportCountry || this.modelValue.passportNum
  internationalTravel: false,
  ...props.value,
})
const form = ref(null)

const travelAuthorizationId = computed(() => {
  return travelerDetails.travelAuthorizationId.toString().padStart(5, "0")
})
const dobMaxDate = computed(() => {
  const currentDate = new Date()
  currentDate.setFullYear(currentDate.getFullYear() - 18)
  return currentDate.toISOString().slice(0, 10)
})

watch(
  travelerDetails,
  (newValue) => {
    emit("input", cloneDeep({ ...props.value, ...newValue }))
  },
  {
    deep: true,
  }
)

function validate() {
  if (isNil(form.value)) {
    throw new Error("Form could not be found")
  }

  // TODO: add validation for additional fields
  // passportNum and passportCountry are required if internationalTravel is set
  // travelPhone and travelEmail are required if travelContact is present

  return form.value.validate()
}

defineExpose({
  validate,
})
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css"></style>
