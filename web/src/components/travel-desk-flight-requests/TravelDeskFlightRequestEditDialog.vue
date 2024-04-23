<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="80%"
  >
    <v-form
      ref="form"
      v-model="isValid"
      @submit.prevent="updateAndClose"
    >
      <v-card :loading="isLoading">
        <v-card-title class="blue">
          <div class="text-h5">Edit Flight</div>
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
              <!-- TODO: make this a component -->
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
            Close
          </v-btn>
          <v-btn
            :loading="isLoading"
            color="green darken-1"
            type="submit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { cloneDeep } from "lodash"
import { ref, nextTick, watch, computed } from "vue"
import { useRoute, useRouter } from "vue2-helpers/vue-router"

import { required } from "@/utils/validators"

import { useSnack } from "@/plugins/snack-plugin"

import travelDeskFlightRequestsApi from "@/api/travel-desk-flight-requests-api"

import LocationsAutocomplete from "@/components/locations/LocationsAutocomplete.vue"
import SeatPreferenceSelect from "@/components/travel-desk-flight-requests/SeatPreferenceSelect.vue"

defineProps({
  minDate: {
    type: String,
    default: "",
  },
  maxDate: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["saved"])

const flightRequest = ref({})
const flightRequestId = computed(() => flightRequest.value.id)

const snack = useSnack()
const router = useRouter()
const route = useRoute()
const showDialog = ref(false)

/** @type {import("vue").Ref<InstanceType<typeof import("vuetify/lib").VForm> | null>} */
const form = ref(null)
const isLoading = ref(false)
const isValid = ref(false)

watch(
  () => showDialog.value,
  (value) => {
    if (value) {
      if (route.query.showFlightRequestEdit === flightRequestId.value?.toString()) {
        return
      }

      router.push({ query: { showFlightRequestEdit: flightRequestId.value } })
    } else {
      router.push({ query: { showFlightRequestEdit: undefined } })
    }
  }
)

function show(newFlightRequest) {
  flightRequest.value = cloneDeep(newFlightRequest)
  showDialog.value = true
}

function close() {
  showDialog.value = false
  resetFlightRequest()
  form.value?.resetValidation()
}

async function updateAndClose() {
  if (!isValid.value) {
    snack("Please fill in all required fields", { color: "error" })
    return
  }

  isLoading.value = true
  try {
    if (flightRequestId.value === undefined) {
      throw new Error("Flight request could not be found")
    }

    const { travelDeskFlightRequest: newFlightRequest } = await travelDeskFlightRequestsApi.update(
      flightRequestId.value,
      flightRequest.value
    )
    close()

    await nextTick()
    emit("saved", newFlightRequest.id)
    snack("Flight request saved", { color: "success" })
  } catch (error) {
    snack("Failed to save flight request", { color: "error" })
  } finally {
    isLoading.value = false
  }
}

function resetFlightRequest() {
  flightRequest.value = {}
}

defineExpose({
  show,
})
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
