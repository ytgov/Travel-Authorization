<template>
  <v-card>
    <v-card-title>
      <h3>Questions</h3>
    </v-card-title>
    <v-card-text>
      <TravelDeskQuestionsDataTable
        :where="{
          travelRequestId: travelDeskTravelRequestId,
        }"
        route-query-suffix="TravelDeskQuestion"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import TravelDeskQuestionsDataTable from "@/components/travel-desk-questions/TravelDeskQuestionsDataTable.vue"

defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})
</script>
