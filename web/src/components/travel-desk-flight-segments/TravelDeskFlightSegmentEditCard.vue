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
  () => props.flightSegment,
  (newFlightSegment) => {
    flightSegmentAttributes.value = { ...newFlightSegment }
  },
  { immediate: true }
)

watch(
  () => flightSegmentAttributes.value,
  (newFlightSegmentAttributes) => {
    const { departDay, departTime, arriveDay, arriveTime, ...trueFlightSegmentAttributes } =
      newFlightSegmentAttributes

    if (departDay && departTime) {
      trueFlightSegmentAttributes.departAt = `${departDay}T${departTime}:00.000Z`
    }

    if (arriveDay && arriveTime) {
      trueFlightSegmentAttributes.arriveAt = `${arriveDay}T${arriveTime}:00.000Z`
    }

    delete newFlightSegmentAttributes.departDay
    delete newFlightSegmentAttributes.departTime
    delete newFlightSegmentAttributes.arriveDay
    delete newFlightSegmentAttributes.arriveTime

    emit("update:flightSegment", trueFlightSegmentAttributes)
  }
)
</script>

<style scoped>
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
