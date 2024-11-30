<template>
  <v-data-iterator
    :items="travelDeskFlightOptions"
    :server-items-length="totalCount"
  >
    <template #default="{ items }">
      <v-row
        v-for="item in items"
        :key="item.id"
      >
        <v-col>
          <TravelDeskFlightOptionCard
            :flight-option="item"
            :opt-len="totalCount"
            travel-desk-user
          />
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script setup>
import { computed } from "vue"

import useTravelDeskFlightOptions from "@/use/use-travel-desk-flight-options"

import TravelDeskFlightOptionCard from "@/components/travel-desk-flight-options/TravelDeskFlightOptionCard.vue"

const props = defineProps({
  where: {
    type: Object,
    default: () => ({}),
  },
  filters: {
    type: Object,
    default: () => ({}),
  },
})

const travelDeskFlightOptionsQuery = computed(() => ({
  where: props.where,
  filters: props.filters,
}))
const { travelDeskFlightOptions, totalCount } = useTravelDeskFlightOptions(
  travelDeskFlightOptionsQuery
)
</script>
