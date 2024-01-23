<template>
  <v-container>
    TODO: Build out estimate page for travel authorization.
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
