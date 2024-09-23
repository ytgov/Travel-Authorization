<template>
  <v-card
    :loading="isLoading"
    :disabled="isLoading"
  >
    <v-card-title class="primary">
      <h3 class="mb-1">Travel Desk Request</h3>
    </v-card-title>

    <div
      v-if="isNil(travelDeskTravelRequest)"
      class="mt-10"
      style="text-align: center"
    >
      loading ...
    </div>
    <v-card-text v-else>
      <v-row>
        <v-col cols="12">
          <TravelerDetailsFormCard
            ref="travelerDetailsFormCard"
            v-model="travelDeskTravelRequest"
            :show-save-state-progress="true"
            :is-saving="isLoading"
            class="mt-4"
            @save-requested="saveAndNotify"
            @input="debouncedSaveAndNotify"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <h4 class="text-h6">Travel Information</h4>
            </v-card-title>
            <v-card-text>
              <TitleCard class="mt-5 mx-5">
                <template #title>
                  <div>Flight Request</div>
                </template>
                <template #body>
                  <v-row
                    class="mt-0"
                    no-gutters
                  >
                    <v-col cols="12">
                      <TravelDeskFlightRequestsEditTable
                        :travel-desk-travel-request-id="travelDeskTravelRequestId"
                        :travel-authorization-id="travelAuthorizationId"
                        class="borderless-card"
                        @updated="refreshTablesUsingFlightInfo"
                      />
                    </v-col>
                  </v-row>
                  <v-row
                    class="ml-3"
                    no-gutters
                  >
                    <v-col cols="12">
                      <SaveStateProgress
                        class="float-right my-0 mr-3 ml-3 hidden-sm-and-down"
                        :saving="isLoading"
                        @click="saveAndNotify"
                      />
                      <v-textarea
                        v-model="travelDeskTravelRequest.additionalInformation"
                        class="mt-5 mr-5"
                        label="Additional Information"
                        outlined
                        auto-grow
                        counter
                        @input="debouncedSaveAndNotify"
                      />
                    </v-col>
                  </v-row>
                </template>
              </TitleCard>

              <TravelDeskRentalCarsEditTable
                ref="travelDeskRentalCarsEditTable"
                :travel-desk-travel-request-id="travelDeskTravelRequestId"
                :travel-authorization-id="travelAuthorizationId"
              />
              <TravelDeskHotelsEditTable
                ref="travelDeskHotelEditTable"
                :travel-desk-travel-request-id="travelDeskTravelRequestId"
                :travel-authorization-id="travelAuthorizationId"
              />
              <TravelDeskOtherTransportationsEditTable
                :travel-desk-travel-request-id="travelDeskTravelRequestId"
                :travel-authorization-id="travelAuthorizationId"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn
        class="ml-auto mr-2"
        color="green darken-1"
        :loading="isLoading"
        @click="saveAndNotify"
      >
        Save Draft
      </v-btn>
      <v-btn
        class="mr-5 px-5"
        color="brown darken-1"
        :loading="isLoading"
        @click="submitAndNotify"
        >Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, ref, toRefs } from "vue"
import { debounce, isNil } from "lodash"
import { useRouter } from "vue2-helpers/vue-router"

import { useSnack } from "@/plugins/snack-plugin"

import useTravelDeskTravelRequest from "@/use/use-travel-desk-travel-request"

import SaveStateProgress from "@/components/SaveStateProgress.vue"
import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"

import TravelDeskFlightRequestsEditTable from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestsEditTable.vue"
import TravelDeskHotelsEditTable from "@/components/travel-desk-hotels/TravelDeskHotelsEditTable.vue"
import TravelDeskOtherTransportationsEditTable from "@/components/travel-desk-other-transportations/TravelDeskOtherTransportationsEditTable.vue"
import TravelDeskRentalCarsEditTable from "@/components/travel-desk-rental-cars/TravelDeskRentalCarsEditTable.vue"
import TravelerDetailsFormCard from "@/components/travel-desk-travel-requests/TravelerDetailsFormCard.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(["state-changed"])

const { travelDeskTravelRequestId } = toRefs(props)
const { travelDeskTravelRequest, isLoading, save, submit } =
  useTravelDeskTravelRequest(travelDeskTravelRequestId)

const travelAuthorizationId = computed(() => travelDeskTravelRequest.value?.travelAuthorizationId)

/** @type {import("vue").Ref<InstanceType<typeof TravelerDetailsFormCard> | null>} */
const travelerDetailsFormCard = ref(null)
/** @type {import("vue").Ref<InstanceType<typeof TravelDeskRentalCarsEditTable> | null>} */
const travelDeskRentalCarsEditTable = ref(null)
/** @type {import("vue").Ref<InstanceType<typeof TravelDeskHotelsEditTable> | null>} */
const travelDeskHotelEditTable = ref(null)

function refreshTablesUsingFlightInfo() {
  travelDeskRentalCarsEditTable.value?.refresh()
  travelDeskHotelEditTable.value?.refresh()
}

const snack = useSnack()
const router = useRouter()

function validate() {
  if (isNil(travelerDetailsFormCard.value)) {
    throw new Error("Travel details form could not be found")
  }

  return travelerDetailsFormCard.value.validate()
}

async function saveAndNotify() {
  if (validate() !== true) {
    snack("Form validation failed! Please fill out all required fields.", {
      color: "error",
    })
    return
  }

  try {
    await save()
    snack("Request updated.", { color: "success" })
  } catch (error) {
    snack(`Failed to save request: ${error}`, { color: "error" })
  }
}

const debouncedSaveAndNotify = debounce(saveAndNotify, 1000)

async function submitAndNotify() {
  if (validate() !== true) {
    snack("Form validation failed! Please fill out all required fields.", {
      color: "error",
    })
    return
  }

  try {
    await submit()
    emit("state-changed")
    snack("Request submitted.", { color: "success" })
    router.replace({
      name: "my-travel-requests/request/RequestPage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    })
    return
  } catch (error) {
    snack(`Failed to submit request: ${error}`, { color: "error" })
  }
}
</script>

<style scoped></style>

<style scoped>
.v-card.borderless-card {
  border: none !important;
  box-shadow: none !important;
}
</style>
