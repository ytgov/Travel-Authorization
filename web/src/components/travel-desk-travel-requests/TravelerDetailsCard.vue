<template>
  <TitleCard
    class="mt-10"
    large-title
  >
    <template #title>
      <div>Traveler Details</div>
    </template>
    <template
      v-if="isLoading"
      #body
    >
      <v-skeleton-loader type="card" />
    </template>
    <template
      v-else
      #body
    >
      <!--
        TODO: make this less ugly and hard to read.
        Vuetify 3 has a "text" variant that looks better than the "outlined" variant + lock icon.
        An alternative is the DescriptionElement from the WRAP project.
        See https://github.com/icefoganalytics/wrap/blob/8bcf794a3fdfd5272a578058bcf98663b181d7ab/web/src/components/DescriptionElement.vue
      -->
      <v-row class="mt-5 mx-3">
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelDeskTravelRequest.legalFirstName"
            label="Legal First Name *"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelDeskTravelRequest.legalMiddleName"
            label="Legal Middle Name"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelDeskTravelRequest.legalLastName"
            label="Legal Last Name *"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelDeskTravelRequest.birthDate"
            label="Birth Date"
            outlined
            type="date"
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="prettyTravelAuthorizationId"
            label="Travel Auth"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
      </v-row>
      <v-row class="mt-0 mx-3">
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelDeskTravelRequest.strAddress"
            label="Address *"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelDeskTravelRequest.city"
            label="City *"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelDeskTravelRequest.province"
            label="Province *"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelDeskTravelRequest.postalCode"
            label="Postal Code *"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-checkbox
            :value="travelDeskTravelRequest.isInternationalTravel"
            label="International travel"
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
      </v-row>
      <v-row
        v-if="travelDeskTravelRequest.isInternationalTravel"
        class="mt-0 mx-3"
      >
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            :value="travelDeskTravelRequest.passportNum"
            label="Passport Number *"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            :value="travelDeskTravelRequest.passportCountry"
            label="Passport Country *"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
      </v-row>

      <v-row class="mt-0 mx-3">
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelDeskTravelRequest.busPhone"
            label="Business Phone *"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelDeskTravelRequest.busEmail"
            label="Business Email *"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-checkbox
            :value="travelDeskTravelRequest.travelContact"
            label="Contact information different for travel"
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
      </v-row>
      <v-row
        v-if="travelDeskTravelRequest.travelContact"
        class="mt-0 mx-3"
      >
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelDeskTravelRequest.travelPhone"
            label="Travel Phone *"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            :value="travelDeskTravelRequest.travelEmail"
            label="Travel Email *"
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
      </v-row>
      <v-row
        class="mt-0 mx-3"
      >
        <v-col cols="12">
          <v-textarea
            :value="travelDeskTravelRequest?.additionalInformation"
            label="Additional Information"
            outlined
            auto-grow
            counter
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
      </v-row>
    </template>
  </TitleCard>
</template>

<script setup>
import { computed, toRefs } from "vue"

import useTravelDeskTravelRequest from "@/use/use-travel-desk-travel-request"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

const { travelDeskTravelRequestId } = toRefs(props)
const { travelDeskTravelRequest, isLoading } = useTravelDeskTravelRequest(travelDeskTravelRequestId)

const prettyTravelAuthorizationId = computed(() => {
  return travelDeskTravelRequest.value.travelAuthorizationId.toString().padStart(5, "0")
})
</script>

<style scoped></style>
