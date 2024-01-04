<template>
  <div class="mt-4">
    <EstimatesTable :travel-authorization-id="travelAuthorizationId" />
  </div>
</template>

<script setup>
import EstimatesTable from "@/modules/travel-authorizations/components/read-travel-authorization-estimate-page/EstimatesTable"

defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})
</script>
