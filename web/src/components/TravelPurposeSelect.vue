<!-- See https://stackoverflow.com/a/50892881 for slot syntax -->
<template>
  <v-select
    :value="props.value"
    :items="travelPurposes"
    :loading="isLoading"
    item-text="purpose"
    item-value="id"
    label="Travel Purpose"
    v-bind="$attrs"
    v-on="$listeners"
    @input="emit('input', $event)"
    ><template
      v-for="(_, slotName) in $scopedSlots"
      #[slotName]="slotData"
      ><slot
        :name="slotName"
        v-bind="slotData"
      ></slot></template
  ></v-select>
</template>

<script setup>
import useTravelPurposes from "@/use/use-travel-purposes"

const props = defineProps({
  value: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(["input"])

const { travelPurposes, isLoading } = useTravelPurposes()
</script>
