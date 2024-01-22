import travelAuthorization from '@/store/travel-authorization';
<template>
  <v-container>
    TODO: add edit page for travel authorization details also add layout for this page
    <pre>
      {{ travelAuthorization }}

    </pre>
  </v-container>
</template>

<script setup>
import { useTravelAuthorization } from "@/use/travel-authorization"
import { watch } from "vue"

const props = defineProps({
  travelAuthorizationId: {
    type: String,
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
