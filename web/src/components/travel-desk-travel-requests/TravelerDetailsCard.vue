<template>
  <v-skeleton-loader
    v-if="isNil(travelDeskTravelRequest)"
    type="card"
  />
  <v-card v-else>
    <v-card-title>
      <h3>Traveler Details</h3>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="body-1 text--primary">
      <dl>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <dt class="font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-account-details</v-icon
              >
              <span>Legal First Name</span>
            </dt>
            <dd class="mt-2 font-weight-medium">
              {{ travelDeskTravelRequest.legalFirstName }}
            </dd>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-account-details</v-icon
              >
              <span>Legal Middle Name</span>
            </dt>
            <dd class="mt-2 font-weight-medium">
              {{ travelDeskTravelRequest.legalMiddleName || "N/A" }}
            </dd>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-account-details</v-icon
              >
              <span>Legal Last Name</span>
            </dt>
            <dd class="mt-2 font-weight-medium">
              {{ travelDeskTravelRequest.legalLastName }}
            </dd>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-calendar</v-icon
              >
              <span>Birth Date</span>
            </dt>
            <dd class="mt-2 font-weight-medium">{{ travelDeskTravelRequest.birthDate }}</dd>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-key</v-icon
              >
              <span>Travel Auth</span>
            </dt>
            <dd class="mt-2 font-weight-medium">{{ prettyTravelAuthorizationId }}</dd>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-phone</v-icon
              >
              <span>Business Phone</span>
            </dt>
            <dd class="mt-2 font-weight-medium">{{ travelDeskTravelRequest.busPhone }}</dd>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-email</v-icon
              >
              <span>Business Email</span>
            </dt>
            <dd class="mt-2 font-weight-medium">{{ travelDeskTravelRequest.busEmail }}</dd>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-airplane</v-icon
              >
              <span>International Travel</span>
            </dt>
            <dd class="mt-2 font-weight-medium">
              {{ travelDeskTravelRequest.isInternationalTravel ? "Yes" : "No" }}
            </dd>
          </v-col>
        </v-row>

        <v-row v-if="travelDeskTravelRequest.isInternationalTravel">
          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-passport</v-icon
              >
              <span>Passport Number</span>
            </dt>
            <dd class="mt-2 font-weight-medium">
              {{ travelDeskTravelRequest.passportNum }}
            </dd>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-flag</v-icon
              >
              <span>Passport Country</span>
            </dt>
            <dd class="mt-2 font-weight-medium">
              {{ travelDeskTravelRequest.passportCountry }}
            </dd>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-home</v-icon
              >
              <span>Address</span>
            </dt>
            <dd class="mt-2 font-weight-medium">{{ travelDeskTravelRequest.strAddress }}</dd>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-city</v-icon
              >
              <span>City</span>
            </dt>
            <dd class="mt-2 font-weight-medium">{{ travelDeskTravelRequest.city }}</dd>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-map</v-icon
              >
              <span>Province</span>
            </dt>
            <dd class="mt-2 font-weight-medium">{{ travelDeskTravelRequest.province }}</dd>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-mailbox</v-icon
              >
              <span>Postal Code</span>
            </dt>
            <dd class="mt-2 font-weight-medium">{{ travelDeskTravelRequest.postalCode }}</dd>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-account-switch</v-icon
              >
              <span>Different Travel Contact</span>
            </dt>
            <dd class="mt-2 font-weight-medium">
              {{ travelDeskTravelRequest.travelContact ? "Yes" : "No" }}
            </dd>
          </v-col>
        </v-row>

        <v-row v-if="travelDeskTravelRequest.travelContact">
          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-phone</v-icon
              >
              <span>Travel Phone</span>
            </dt>
            <dd class="mt-2 font-weight-medium">{{ travelDeskTravelRequest.travelPhone }}</dd>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-email</v-icon
              >
              <span>Travel Email</span>
            </dt>
            <dd class="mt-2 font-weight-medium">{{ travelDeskTravelRequest.travelEmail }}</dd>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <v-row>
          <v-col cols="12">
            <dt class="d-flex align-center font-weight-bold">
              <v-icon
                size="18"
                class="mr-2"
                aria-hidden="true"
                >mdi-text</v-icon
              >
              <span>Additional Information</span>
            </dt>
            <dd class="mt-2 font-weight-medium">
              {{ travelDeskTravelRequest?.additionalInformation || "N/A" }}
            </dd>
          </v-col>
        </v-row>
      </dl>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, toRefs } from "vue"
import { isNil } from "lodash"

import useTravelDeskTravelRequest from "@/use/use-travel-desk-travel-request"

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
