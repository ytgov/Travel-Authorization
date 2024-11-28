<template>
  <v-card>
    <v-card-title>
      <h3>Flight Requests</h3>
    </v-card-title>
    <v-card-text>
      <div class="d-flex justify-end">
        <TravelDeskFlightRequestCreateDialog
          :attributes="{
            travelRequestId: travelDeskTravelRequestId,
          }"
          :min-date="minDate"
          :max-date="maxDate"
          @created="refresh"
        />
      </div>
      <TravelDeskFlightRequestsEditTable
        ref="travelDeskFlightRequestsEditTable"
        :where="{
          travelRequestId: travelDeskTravelRequestId,
        }"
        route-query-suffix="TravelDeskFlightRequest"
        :min-date="minDate"
        :max-date="maxDate"
        @updated="emit('updated')"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref, toRefs } from "vue"
import { first, last } from "lodash"

import useTravelAuthorization from "@/use/use-travel-authorization"

import TravelDeskFlightRequestCreateDialog from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestCreateDialog.vue"
import TravelDeskFlightRequestsEditTable from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestsEditTable.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(["updated"])

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const firstTravelSegment = computed(() => first(travelAuthorization.value?.travelSegments))
const lastTravelSegment = computed(() => last(travelAuthorization.value?.travelSegments))

const minDate = computed(() => firstTravelSegment.value?.departureOn)
const maxDate = computed(() => lastTravelSegment.value?.departureOn)

/** @type {import("vue").Ref<InstanceType<typeof TravelDeskFlightRequestsEditTable> | null>} */
const travelDeskFlightRequestsEditTable = ref(null)

async function refresh() {
  emit("updated")
  await travelDeskFlightRequestsEditTable.value?.refresh()
}
</script>
