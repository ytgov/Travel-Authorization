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
        Add Hotel
      </v-btn>
    </template>

    <v-form
      ref="form"
      @submit.prevent="createAndClose"
    >
      <v-card :loading="isLoading">
        <v-card-title class="blue">
          <div class="text-h5">Add Hotel</div>
        </v-card-title>

        <v-card-text>
          <v-row class="mt-5 mx-3">
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="hotel.checkIn"
                label="Check-in Date *"
                type="date"
                :rules="[required]"
                :min="minDate"
                :max="maxDate"
                outlined
                required
              />
              <v-text-field
                v-model="hotel.checkOut"
                label="Check-out Date *"
                type="date"
                :rules="[required]"
                :min="minDate"
                :max="maxDate"
                outlined
                required
              />
              <LocationsAutocomplete
                v-model="hotel.city"
                label="City *"
                item-value="city"
                :rules="[required]"
                outlined
                required
              />
              <v-radio-group
                v-model="hotel.isDedicatedConferenceHotelAvailable"
                label="Conference/Meeting Hotel? *"
                :rules="[required]"
                outlined
                required
                row
              >
                <v-radio
                  label="Yes"
                  :value="true"
                ></v-radio>
                <v-radio
                  label="No"
                  :value="false"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-textarea
                v-model="hotel.additionalInformation"
                label="Additional Information"
                rows="8"
                outlined
                clearable
              />
            </v-col>
          </v-row>

          <v-row class="mt-0 mx-3">
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="hotel.conferenceName"
                label="Conference/Meeting Name *"
                :rules="[required]"
                outlined
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                v-model="hotel.conferenceHotelName"
                label="Conference/Meeting Hotel *"
                :rules="[required]"
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
import { ref, nextTick, watch, watchEffect } from "vue"
import { useRoute, useRouter } from "vue2-helpers/vue-router"
import { isNil } from "lodash"

import { required } from "@/utils/validators"
import { useSnack } from "@/plugins/snack-plugin"
import travelDeskHotelsApi from "@/api/travel-desk-hotels-api"

import LocationsAutocomplete from "@/components/locations/LocationsAutocomplete.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
  minDate: {
    type: String,
    default: null,
  },
  maxDate: {
    type: String,
    default: null,
  },
  // TODO: consider loading flightStart/End using travelDeskTravelRequestId?
  flightStart: {
    type: String,
    default: null,
  },
  flightEnd: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(["created"])

const hotel = ref({
  travelRequestId: props.travelDeskTravelRequestId,
  checkIn: props.flightStart,
  checkOut: props.flightEnd,
  isDedicatedConferenceHotelAvailable: true,
})

const snack = useSnack()
const router = useRouter()
const route = useRoute()
const showDialog = ref(route.query.showHotelCreate === "true")

/** @type {import("vue").Ref<InstanceType<typeof import("vuetify/lib").VForm> | null>} */
const form = ref(null)
const isLoading = ref(false)

watch(
  () => props.travelDeskTravelRequestId,
  () => {
    resetState()
  },
  { immediate: true }
)

watchEffect(() => {
  if (isNil(hotel.value.checkIn)) {
    hotel.value.checkIn = props.flightStart
  }
})

watchEffect(() => {
  if (isNil(hotel.value.checkOut)) {
    hotel.value.checkOut = props.flightEnd
  }
})

watch(
  () => showDialog.value,
  (value) => {
    if (value) {
      router.push({ query: { showHotelCreate: "true" } })
    } else {
      router.push({ query: { showHotelCreate: undefined } })
    }
  }
)

function close() {
  showDialog.value = false
  resetState()
  form.value?.resetValidation()
}

async function createAndClose() {
  if (!form.value?.validate()) {
    snack("Please fill in all required fields", { color: "error" })
    return
  }

  isLoading.value = true
  try {
    const { travelDeskHotel: newHotel } = await travelDeskHotelsApi.create(hotel.value)
    close()

    await nextTick()
    emit("created", newHotel.id)
    snack("Hotel request created successfully", { color: "success" })
  } catch (error) {
    console.error(error)
    snack("Failed to create hotel request", { color: "error" })
  } finally {
    isLoading.value = false
  }
}

function resetState() {
  hotel.value = {
    travelRequestId: props.travelDeskTravelRequestId,
    checkIn: props.flightStart,
    checkOut: props.flightEnd,
    isDedicatedConferenceHotelAvailable: true,
  }
}
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
