<template>
  <div>
    <title-card
      class="mt-10"
      title-width="11rem"
      large-title
    >
      <template #title>
        <div>Traveler Details</div>
      </template>
      <template #body>
        <v-row class="mt-5 mx-3">
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.legalFirstName"
              :error="travelerState.firstNameErr"
              label="Legal First Name"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.legalMiddleName"
              :error="travelerState.middleNameErr"
              label="Legal Middle Name"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.legalLastName"
              :error="travelerState.lastNameErr"
              label="Legal Last Name"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.birthDate"
              :error="travelerState.birthDateErr"
              label="Birth Date"
              outlined
              :max="dobMaxDate"
              type="date"
              @input="travelerState.birthDateErr = false"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelAuthorizationId"
              readonly
              :error="travelerState.travelAuthErr"
              label="Travel Auth"
              outlined
            />
          </v-col>
        </v-row>
        <v-row class="mt-0 mx-3">
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.strAddress"
              :error="travelerState.addressErr"
              label="Address"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <LocationsAutocomplete
              v-model="travelerDetails.city"
              item-value="city"
              :error="travelerState.cityErr"
              label="City"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.province"
              :error="travelerState.provinceErr"
              label="Province"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.postalCode"
              :error="travelerState.postalCodeErr"
              label="Postal Code"
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
              :error="travelerState.passportNumberErr"
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
              :error="travelerState.passportCountryErr"
              label="Passport Country"
              outlined
            />
          </v-col>
        </v-row>

        <v-row class="mt-0 mx-3">
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.busPhone"
              :rules="[rules.phone]"
              :error="travelerState.businessPhoneErr"
              label="Business Phone"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="travelerDetails.busEmail"
              :rules="[rules.email]"
              :error="travelerState.businessEmailErr"
              label="Business Email"
              outlined
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
              :rules="[rules.phone]"
              :error="travelerState.travelPhoneErr"
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
              :rules="[rules.email]"
              :error="travelerState.travelEmailErr"
              label="Travel Email"
              outlined
            />
          </v-col>
        </v-row>
      </template>
    </title-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue"
import { cloneDeep } from "lodash"

import LocationsAutocomplete from "@/components/locations/LocationsAutocomplete.vue"
import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
  travelerState: {
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
const travelAuthorizationId = ref("")
const dobMaxDate = ref("")
const rules = {
  phone: (value) => {
    const pattern = /^[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}((\s\x[0-9]{4})|)?$/
    return pattern.test(value) || "Invalid Phone (888-888-8888)"
  },
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || "Invalid e-mail."
  },
}

watch(
  travelerDetails,
  (newValue) => {
    emit("input", cloneDeep({ ...props.value, ...newValue }))
  },
  {
    deep: true,
  }
)

onMounted(() => {
  travelAuthorizationId.value = travelerDetails.travelAuthorizationId.toString().padStart(5, "0")

  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() - 18 * 365)
  dobMaxDate.value = currentDate.toISOString().slice(0, 10)
})
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css"></style>
