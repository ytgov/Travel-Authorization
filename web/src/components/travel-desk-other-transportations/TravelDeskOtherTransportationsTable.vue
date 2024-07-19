<template>
  <TitleCard
    class="mt-10 mx-5 mb-5"
    title-width="16.5rem"
  >
    <template #title>
      <div>Other Transportation Request</div>
    </template>
    <template #body>
      <v-row class="mb-3 mx-3">
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="travelDeskOtherTransportations"
            :loading="isLoading"
            hide-default-footer
            class="elevation-1"
          >
            <template #item.date="{ item }">
              {{ formatDate(item.date) }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </template>
  </TitleCard>
</template>

<script setup>
import { computed, ref } from "vue"
import { DateTime } from "luxon"

import useTravelDeskOtherTransportations from "@/use/use-travel-desk-other-transportations"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

const headers = ref([
  {
    text: "Type",
    value: "transportationType",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  { text: "Depart Location", value: "depart", class: "blue-grey lighten-4", sortable: false },
  { text: "Arrive Location", value: "arrive", class: "blue-grey lighten-4", sortable: false },
  { text: "Date", value: "date", class: "blue-grey lighten-4" },
  {
    text: "Additional Information",
    value: "additionalNotes",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "",
    value: "actions",
    class: "blue-grey lighten-4",
    width: "4rem",
    sortable: false,
  },
])

const travelDeskOtherTransportationsQuery = computed(() => ({
  where: {
    travelRequestId: props.travelDeskTravelRequestId,
  },
}))
const { travelDeskOtherTransportations, isLoading } = useTravelDeskOtherTransportations(
  travelDeskOtherTransportationsQuery
)

function formatDate(date) {
  return DateTime.fromISO(date, { zone: "utc" }).toFormat("MMM dd yyyy")
}
</script>

<style scoped></style>
