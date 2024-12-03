<template>
  <div>
    <TitleCard
      class="mt-5"
      title-width="3.5rem"
    >
      <template #title>
        <div>Flight</div>
      </template>
      <template #body>
        <v-row class="mt-2 mx-0">
          <div style="width: 1.5%" />
          <div style="width: 29%">
            <v-text-field
              v-model="flightSegment.flightNumber"
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
              v-model="flightSegment.departDay"
              label="Departure Date *"
              type="date"
              :rules="[required]"
              outlined
              required
              @input="changeDate"
            />
          </div>
          <div style="width: 0.2%" />
          <div style="width: 10%">
            <v-text-field
              v-model="flightSegment.departTime"
              label="Departure Time *"
              type="time"
              :rules="[required]"
              outlined
              required
              @input="changeDate"
            />
          </div>
          <div style="width: 0.5%" />
          <div style="width: 42%">
            <v-text-field
              v-model="flightSegment.departLocation"
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
              v-model="flightSegment.duration"
              label="Duration *"
              :rules="[required]"
              outlined
              required
            />
          </div>
          <div style="width: 0.5%" />
          <div style="width: 15%">
            <v-text-field
              v-model="flightSegment.arriveDay"
              label="Arrival Date *"
              type="date"
              :rules="[required]"
              outlined
              required
              @input="changeDate"
            />
          </div>
          <div style="width: 0.2%" />
          <div style="width: 10%">
            <v-text-field
              v-model="flightSegment.arriveTime"
              label="Arrival Time *"
              :rules="[required]"
              type="time"
              outlined
              required
              @input="changeDate"
            />
          </div>
          <div style="width: 0.5%" />
          <div style="width: 42%">
            <v-text-field
              v-model="flightSegment.arriveLocation"
              label="Arrive To *"
              :rules="[required]"
              outlined
              required
            />
          </div>
          <div style="width: 0.5%" />
          <div style="width: 7%">
            <v-text-field
              v-model="flightSegment.status"
              label="Status *"
              :rules="[required]"
              outlined
              required
            />
          </div>
          <div style="width: 0.5%" />
          <div style="width: 6%">
            <v-text-field
              v-model="flightSegment.class"
              label="Class *"
              :rules="[required]"
              outlined
              required
            />
          </div>
          <div style="width: 0.5%" />
        </v-row>
      </template>
    </TitleCard>
  </div>
</template>

<script setup>
import { required } from "@/utils/validators"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"

const props = defineProps({
  flightSegment: {
    type: Object,
    required: true,
  },
})

function changeDate() {
  if (props.flightSegment.departDay && props.flightSegment.departTime) {
    props.flightSegment.departAt =
      props.flightSegment.departDay + "T" + props.flightSegment.departTime + ":00.000Z"
  }

  if (props.flightSegment.arriveDay && props.flightSegment.arriveTime) {
    props.flightSegment.arriveAt =
      props.flightSegment.arriveDay + "T" + props.flightSegment.arriveTime + ":00.000Z"
  }
}
</script>

<style scoped>
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
