<template>
  <div v-if="dataReady">
    <v-row class="mt-0 mb-0 mx-0">
      <v-col
        cols="2"
        class="px-0"
      >
        <div style="font-size: 9pt">Preference</div>
        <v-select
          label="Preference"
          :value="flightOption.flightPreferenceOrder"
          :items="preferenceList"
          :hint="
            flightOption.flightPreferenceOrder === DOES_NOT_WORK
              ? travelDeskUser
                ? 'Please see the Additional Information.'
                : 'Please add your comment to the Additional Information field.'
              : ''
          "
          class="mr-2"
          persistent-hint
          solo
        />
      </v-col>

      <v-col
        cols="10"
        class="px-0"
      >
        <v-card
          color="#FAFAFA"
          style="border: 2px solid #aaccff !important"
        >
          <v-row class="mt-1 mx-2">
            <b>COST:</b> <b class="ml-2">$ {{ flightOption.cost }}</b>
          </v-row>
          <div
            v-for="(flightSegment, inx) in travelDeskFlightSegments"
            :key="'segment-' + flightSegment.id + '-' + inx"
            class="px-1"
          >
            <table style="width: 100%; margin-top: 1rem">
              <tbody>
                <tr style="line-height: 1rem">
                  <td colspan="3">{{ flightSegment.flightNumber }}</td>
                </tr>
                <tr style="background: #f9f9f9">
                  <td style="width: 16%">Departure:</td>
                  <td style="width: 30%">{{ flightSegment.departAt | beautifyDateTime }}</td>
                  <td style="width: 50%">{{ flightSegment.departLocation }}</td>
                </tr>
                <tr style="line-height: 1rem">
                  <td style="width: 16%">Arrival:</td>
                  <td style="width: 30%">{{ flightSegment.arriveAt | beautifyDateTime }}</td>
                  <td style="width: 50%">{{ flightSegment.arriveLocation }}</td>
                </tr>
                <tr style="background: #f9f9f9">
                  <td style="width: 16%">Duration</td>
                  <td style="width: 30%">
                    {{ flightSegment.duration }}
                  </td>
                  <td style="width: 50%"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from "vue"

import useTravelDeskFlightSegments from "@/use/use-travel-desk-flight-segments"

const props = defineProps({
  flightOption: {
    type: Object,
    required: true,
  },
  optLen: {
    type: Number,
    required: true,
  },
  travelDeskUser: {
    type: Boolean,
    default: false,
  },
})

const travelDeskFlightSegmentsQuery = computed(() => ({
  where: {
    flightOptionId: props.flightOption.id,
  },
}))
const { travelDeskFlightSegments } = useTravelDeskFlightSegments(travelDeskFlightSegmentsQuery)

const preferenceList = ref([])
const dataReady = ref(false)

const DOES_NOT_WORK = -1

onMounted(async () => {
  dataReady.value = false
  preferenceList.value = [
    {
      value: DOES_NOT_WORK,
      text: "Does Not Work",
    },
  ]
  for (let i = 1; i <= props.optLen; i++) {
    preferenceList.value.push({
      value: i,
      text: i,
    })
  }

  await nextTick()
  dataReady.value = true
})
</script>

<style scoped>
::v-deep .v-text-field.v-text-field .v-input__control {
  min-height: 5px;
}
</style>
