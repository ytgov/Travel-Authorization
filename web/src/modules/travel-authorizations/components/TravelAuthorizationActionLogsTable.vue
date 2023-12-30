<template>
  <v-data-table
    :headers="headers"
    :items="travelAuthorizationActionLogs"
    :loading="isLoading"
  >
    <template #item.action="{ value }">
      {{ formatAction(value) }}
    </template>
  </v-data-table>
</template>

<script setup>
import { startCase } from "lodash"
import { onMounted } from "vue"

import { useI18n } from "@/plugins/vue-i18n-plugin"
import { useTravelAuthorizationActionLogs } from "@/use/travel-authorization-action-logs"
const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { t } = useI18n()

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

function formatAction(value) {
  const fallback = startCase(value.replace("_", " "))
  return t(`global.status.${value}`, { $default: fallback })
}
</script>
