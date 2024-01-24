<template>
  <v-container>
    TODO: Build out expense page for travel authorization.
    <pre>
      {{ travelAuthorization }}
    </pre>
  </v-container>
</template>

<script setup>
import { useTravelAuthorization } from "@/use/travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorization } = useTravelAuthorization(props.travelAuthorizationId)
</script>
