<template>
  <v-card>
    <v-card-title><h3>Distance allowance for private vehicle</h3></v-card-title>
    <v-card-text>
      <ul>
        <li>
          <p>
            <v-progress-circular
              v-if="isLoading"
              indeterminate
              size="12"
              width="1"
            />
            <span v-else>{{ travelAllowancePerKilometer }}</span>
            cents (CAD) per kilometer;
          </p>
        </li>
      </ul>
      <p class="mt-4">
        Refer to
        <a
          href="https://www.njc-cnm.gc.ca/directive/d10/v238/s658/en"
          target="_blank"
          >Canada's National Joint Council travel directive, Appendix B</a
        >.
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue"
import { isEmpty, isNil } from "lodash"

import useTravelAllowances, { TRAVEL_ALLOWANCE_ALLOWANCE_TYPES } from "@/use/use-travel-allowances"

const travelAllowancesQuery = computed(() => {
  return {
    where: {
      allowanceType: TRAVEL_ALLOWANCE_ALLOWANCE_TYPES.DISTANCE_ALLOWANCE_PER_KILOMETER,
    },
    perPage: 1,
  }
})
const { travelAllowances, isLoading } = useTravelAllowances(travelAllowancesQuery)

const travelAllowancePerKilometer = computed(() => {
  if (isEmpty(travelAllowances.value)) {
    return ""
  }

  const privateVehicleTravelAllowance = travelAllowances.value[0]
  const { amount: amountInDollars } = privateVehicleTravelAllowance
  return formatInCents(amountInDollars)
})

function formatInCents(amountInDollars) {
  if (isNil(amountInDollars)) {
    return ""
  }

  const formatter = new Intl.NumberFormat("en-CA", {
    style: "decimal",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  return formatter.format(amountInDollars * 100)
}
</script>
