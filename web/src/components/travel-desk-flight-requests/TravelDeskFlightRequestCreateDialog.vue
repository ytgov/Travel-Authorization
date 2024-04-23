<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="80%"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        Add Flight
      </v-btn>
    </template>

    <v-form
      ref="form"
      v-model="isValid"
      @submit.prevent="createAndClose"
    >
      <v-card :loading="isLoading">
        <v-card-title class="blue">
          <div class="text-h5">Add Flight</div>
        </v-card-title>

        <v-card-text>
          <v-row class="mt-5 mx-0">
            <v-col
              cols="12"
              md="4"
            >
              <LocationsAutocomplete
                v-model="flightRequest.departLocation"
                :rules="[required]"
                label="Depart Location *"
                item-value="city"
                outlined
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <LocationsAutocomplete
                v-model="flightRequest.arriveLocation"
                :rules="[required]"
                label="Arrive Location *"
                item-value="city"
                outlined
                required
              />
            </v-col>
          </v-row>
          <v-row class="mt-0 mx-0">
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="flightRequest.datePreference"
                :min="minDate"
                :max="maxDate"
                :rules="[required]"
                label="Date *"
                type="date"
                outlined
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <div class="label">Time Preference *</div>
              <v-radio-group
                v-model="flightRequest.timePreference"
                :rules="[required]"
                class="mt-1"
                row
                required
              >
                <v-radio
                  label="AM"
                  value="AM"
                ></v-radio>
                <v-radio
                  label="PM"
                  value="PM"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <SeatPreferenceSelect
                v-model="flightRequest.seatPreference"
                :rules="[required]"
                label="Seat Preference *"
                outlined
                required
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="isLoading"
            color="grey darken-5"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            :loading="isLoading"
            color="green darken-1"
            type="submit"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { ref, nextTick, watch } from "vue"
import { useRoute, useRouter } from "vue2-helpers/vue-router"

import { required } from "@/utils/validators"

import { useSnack } from "@/plugins/snack-plugin"

import travelDeskFlightRequestsApi from "@/api/travel-desk-flight-requests-api"

import LocationsAutocomplete from "@/components/locations/LocationsAutocomplete.vue"
import SeatPreferenceSelect from "@/components/travel-desk-flight-requests/SeatPreferenceSelect.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
  minDate: {
    type: String,
    default: "",
  },
  maxDate: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["created"])

const flightRequest = ref({
  travelRequestId: props.travelDeskTravelRequestId,
})

const snack = useSnack()
const router = useRouter()
const route = useRoute()
const showDialog = ref(route.query.showFlightRequestCreate === "true")

/** @type {import("vue").Ref<InstanceType<typeof import("vuetify/lib").VForm> | null>} */
const form = ref(null)
const isLoading = ref(false)
const isValid = ref(false)

watch(
  () => props.travelDeskTravelRequestId,
  () => {
    resetFlightRequest()
  },
  { immediate: true }
)

watch(
  () => showDialog.value,
  (value) => {
    if (value) {
      router.push({ query: { showFlightRequestCreate: "true" } })
    } else {
      router.push({ query: { showFlightRequestCreate: undefined } })
    }
  }
)

function close() {
  showDialog.value = false
  resetFlightRequest()
  form.value?.resetValidation()
}

async function createAndClose() {
  if (!isValid.value) {
    snack("Please fill in all required fields", { color: "error" })
    return
  }

  isLoading.value = true
  try {
    const { travelDeskFlightRequest: newFlightRequest } = await travelDeskFlightRequestsApi.create(
      flightRequest.value
    )
    close()

    await nextTick()
    emit("created", newFlightRequest.id)
    snack("Flight request created successfully", { color: "success" })
  } catch (error) {
    snack("Failed to create flight request", { color: "error" })
  } finally {
    isLoading.value = false
  }
}

function resetFlightRequest() {
  flightRequest.value = {
    travelRequestId: props.travelDeskTravelRequestId,
  }
}
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
