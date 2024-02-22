<template>
  <div>
    TODO: Build out expense page for travel authorization.
    <pre>
      {{ travelAuthorization }}
    </pre>
  </div>
</template>

<script setup>
import { useTravelAuthorization } from "@/use/use-travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorization } = useTravelAuthorization(props.travelAuthorizationId)
</script>
