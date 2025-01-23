<template>
  <DescriptionElement
    :value="locationText"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed, toRefs } from "vue"
import { isNil } from "lodash"

import useLocation from "@/use/use-location"

import DescriptionElement from "@/components/common/DescriptionElement.vue"

const props = defineProps({
  locationId: {
    type: Number,
    default: null,
  },
})

const { locationId } = toRefs(props)
const { location } = useLocation(locationId)

const locationText = computed(() => {
  if (isNil(location.value)) return ""

  const { city, province } = location.value
  return `${city} (${province})`
})
</script>
