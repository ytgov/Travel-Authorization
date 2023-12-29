<template>
  <v-data-table
    :headers="headers"
    :items="travelAuthorizationActionLogs"
    :loading="isLoading"
  >
  </v-data-table>
</template>

<script setup>
import { useTravelAuthorizationActionLogs } from "@/use/travel-authorization-action-logs"
import { onMounted } from "vue"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationActionLogs, isLoading, fetch } = useTravelAuthorizationActionLogs({
  where: {
    travelAuthorizationId: props.travelAuthorizationId,
  },
})

const headers = [
  {
    text: "Status",
    value: "action",
  },
  {
    text: "Who",
    value: "actorId",
  },
  {
    text: "Assigned To",
    value: "assigneeId",
  },
  {
    text: "Date",
    value: "createdAt",
  },
  {
    text: "Note",
    value: "note",
  },
]

onMounted(async () => {
  await fetch()
})
</script>
