<template>
  <v-data-iterator :items="travelDeskFlightOptions">
    <template #default="{ items }">
      <v-row
        v-for="item in items"
        :key="item.id"
      >
        <v-col>
          <FlightOptionCard :flight-option="item" />
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script setup>
import FlightOptionCard from "@/modules/travelDesk/views/Requests/RequestDialogs/FlightComponents/FlightOptionCard.vue"

defineProps({
  where: {
    type: Object,
    default: () => ({}),
  },
  filters: {
    type: Object,
    default: () => ({}),
  },
})

console.warn("TODO: implement TravelDeskFlightOptionsDataIterator")
// TODO: load from back-end
const travelDeskFlightOptions = []
</script>
