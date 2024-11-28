<template>
  <TravelDeskFlightRequestsEditTable
    ref="travelDeskFlightRequestsEditTable"
    :expanded.sync="expanded"
    :show-expand="showFlightOptions"
    single-expand
    v-bind="$attrs"
    v-on="$listeners"
    @click:row="(_, { item }) => expandItem(item)"
  >
    <template #expanded-item="{ headers: expandedItemHeaders, item }">
      <td :colspan="expandedItemHeaders.length">
        <TravelDeskFlightOptionsDataIterator
          :where="{
            flightRequestID: item.id,
          }"
        />
      </td>
    </template>
  </TravelDeskFlightRequestsEditTable>
</template>

<script setup>
import { ref } from "vue"

import TravelDeskFlightOptionsDataIterator from "@/components/travel-desk-flight-options/TravelDeskFlightOptionsDataIterator.vue"
import TravelDeskFlightRequestsEditTable from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestsEditTable.vue"

defineProps({
  showFlightOptions: {
    type: Boolean,
    default: false,
  },
})

const expanded = ref([])

function expandItem(item) {
  if (expanded.value.includes(item)) {
    expanded.value = []
  } else {
    expanded.value = [item]
  }
}

/** @type {import("vue").Ref<InstanceType<typeof TravelDeskFlightRequestsEditTable> | null>} */
const travelDeskFlightRequestsEditTable = ref(null)

async function refresh() {
  await travelDeskFlightRequestsEditTable.value?.refresh()
}

defineExpose({
  refresh,
})
</script>

<style scoped></style>
