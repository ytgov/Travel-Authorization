<template>
  <v-card>
    <v-card-title>
      <h3>Questions</h3>
    </v-card-title>
    <v-card-text>
      <div class="d-flex justify-end">
        <TravelDeskQuestionCreateDialog
          :attributes="{
            travelRequestId: travelDeskTravelRequestId,
          }"
          @created="refresh"
        />
      </div>
      <TravelDeskQuestionsEditDataTable
        ref="travelDeskQuestionsEditDataTable"
        :where="{
          travelRequestId: travelDeskTravelRequestId,
        }"
        route-query-suffix="TravelDeskQuestion"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from "vue"

import TravelDeskQuestionCreateDialog from "@/components/travel-desk-questions/TravelDeskQuestionCreateDialog.vue"
import TravelDeskQuestionsEditDataTable from "@/components/travel-desk-questions/TravelDeskQuestionsEditDataTable.vue"

defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

/** @type {import("vue").Ref<InstanceType<typeof TravelDeskQuestionsEditDataTable> | null>} */
const travelDeskQuestionsEditDataTable = ref(null)

function refresh() {
  travelDeskQuestionsEditDataTable.value?.refresh()
}
</script>
