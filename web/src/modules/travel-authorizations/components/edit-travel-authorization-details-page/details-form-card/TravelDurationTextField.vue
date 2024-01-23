<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <div
        class="d-flex align-start"
        v-bind="attrs"
        v-on="on"
      >
        <v-text-field
          :value="props.value"
          :style="{ minWidth: '80px' }"
          label="# Days"
          dense
          outlined
          disabled
          readonly
          v-bind="$attrs"
          v-on="$listeners"
          ><template
            v-for="(_, slotName) in $scopedSlots"
            #[slotName]="slotData"
            ><slot
              :name="slotName"
              v-bind="slotData"
            ></slot></template
        ></v-text-field>
        <v-icon
          class="ml-1"
          small
        >
          mdi-help-circle-outline
        </v-icon>
      </div>
    </template>
    <span>This is computed from the start and end dates of the trip.</span>
  </v-tooltip>
</template>

<script setup>
import { watch } from "vue"
import { computed } from "vue"
import { DateTime } from "luxon"
import { first, isNil, last, max } from "lodash"

const props = defineProps({
  value: {
    type: Number,
    default: () => 0,
  },
  stops: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(["input"])

const originDestination = computed(() => first(props.stops) || {})
const finalDestination = computed(() => last(props.stops) || {})
const travelDuration = computed(() =>
  computeTravelDuration(originDestination.value, finalDestination.value)
)

watch(
  () => travelDuration.value,
  () => {
    emit("input", travelDuration.value)
  },
  { immediate: true }
)

function computeTravelDuration(originDestination, finalDestination) {
  if (isNil(originDestination.departureDate) || isNil(finalDestination.departureDate)) {
    return null
  }

  const departureDateOrigin = DateTime.fromISO(originDestination.departureDate)
  const departureDateFinal = DateTime.fromISO(finalDestination.departureDate)
  const timeDifference = departureDateFinal.diff(departureDateOrigin, "days")
  return max([0, timeDifference.days])
}
</script>
