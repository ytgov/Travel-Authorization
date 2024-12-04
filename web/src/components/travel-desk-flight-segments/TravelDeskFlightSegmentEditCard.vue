<template>
  <v-card>
    <v-card-title>
      <h4>Flight</h4>
    </v-card-title>
    <v-card-text>
      <v-row class="mt-2 mx-0">
        <div style="width: 1.5%" />
        <div style="width: 29%">
          <v-text-field
            v-model="flightSegmentAttributes.flightNumber"
            label="Flight *"
            :rules="[required]"
            outlined
            required
            size="sm"
          />
        </div>
        <div style="width: 0.5%" />
        <div style="width: 15%">
          <v-text-field
            v-model="flightSegmentAttributes.departDay"
            label="Departure Date *"
            type="date"
            :rules="[required]"
            outlined
            required
          />
        </div>
        <div style="width: 0.2%" />
        <div style="width: 10%">
          <v-text-field
            v-model="flightSegmentAttributes.departTime"
            label="Departure Time *"
            type="time"
            :rules="[required]"
            outlined
            required
          />
        </div>
        <div style="width: 0.5%" />
        <div style="width: 42%">
          <v-text-field
            v-model="flightSegmentAttributes.departLocation"
            label="Depart From *"
            :rules="[required]"
            outlined
            required
          />
        </div>
        <div style="width: 0.5%" />
      </v-row>

      <v-row class="mt-n5 mx-0">
        <div style="width: 1.5%" />
        <div style="width: 15%">
          <v-text-field
            v-model="flightSegmentAttributes.duration"
            label="Duration *"
            :rules="[required]"
            outlined
            required
          />
        </div>
        <div style="width: 0.5%" />
        <div style="width: 15%">
          <v-text-field
            v-model="flightSegmentAttributes.arriveDay"
            label="Arrival Date *"
            type="date"
            :rules="[required]"
            outlined
            required
          />
        </div>
        <div style="width: 0.2%" />
        <div style="width: 10%">
          <v-text-field
            v-model="flightSegmentAttributes.arriveTime"
            label="Arrival Time *"
            :rules="[required]"
            type="time"
            outlined
            required
          />
        </div>
        <div style="width: 0.5%" />
        <div style="width: 42%">
          <v-text-field
            v-model="flightSegmentAttributes.arriveLocation"
            label="Arrive To *"
            :rules="[required]"
            outlined
            required
          />
        </div>
        <div style="width: 0.5%" />
        <div style="width: 7%">
          <v-text-field
            v-model="flightSegmentAttributes.status"
            label="Status *"
            :rules="[required]"
            outlined
            required
          />
        </div>
        <div style="width: 0.5%" />
        <div style="width: 6%">
          <v-text-field
            v-model="flightSegmentAttributes.class"
            label="Class *"
            :rules="[required]"
            outlined
            required
          />
        </div>
        <div style="width: 0.5%" />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from "vue"
import { watchDebounced } from "@vueuse/shared"
import { cloneDeep, isEqual } from "lodash"

import { required } from "@/utils/validators"

const props = defineProps({
  flightSegment: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(["update:flightSegment"])

const flightSegmentAttributes = ref({})

watch(
  () => cloneDeep(props.flightSegment),
  (newFlightSegment) => {
    if (isEqual(newFlightSegment, flightSegmentAttributes.value)) return

    flightSegmentAttributes.value = newFlightSegment
  },
  {
    immediate: true,
    deep: true,
  }
)

watchDebounced(
  () => flightSegmentAttributes.value,
  (newFlightSegmentAttributes) => {
    const { departDay, departTime, arriveDay, arriveTime, ...cleanFlightSegmentAttributes } =
      newFlightSegmentAttributes

    if (departDay && departTime) {
      cleanFlightSegmentAttributes.departAt = `${departDay}T${departTime}:00.000Z`
    }

    if (arriveDay && arriveTime) {
      cleanFlightSegmentAttributes.arriveAt = `${arriveDay}T${arriveTime}:00.000Z`
    }

    emit("update:flightSegment", cleanFlightSegmentAttributes)
  },
  {
    deep: true,
    debounce: 300,
  }
)
</script>

<style scoped>
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
