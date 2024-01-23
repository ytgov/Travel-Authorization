<template>
  <v-container>
    TODO: add edit page for travel authorization details also add layout for this page
    <pre>
      {{ travelAuthorization }}
    </pre>
  </v-container>
</template>

<script setup>
import { watch } from "vue"

import { useTravelAuthorization } from "@/use/travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorization, fetch } = useTravelAuthorization(props.travelAuthorizationId)

watch(
  () => props.travelAuthorizationId,
  async () => {
    await fetch()
  },
  {
    immediate: true,
  }
)
</script>
