<template>
  <v-card>
    <v-card-title><h3>Private non-commercial accommodation allowance</h3></v-card-title>
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
            <span v-else>{{ privateAccommodationsAllowanceCanada }}</span>
            per night (In Yukon, NWT and rest of Canada)
          </p>
        </li>
        <li>
          <p>
            <v-progress-circular
              v-if="isLoading"
              indeterminate
              size="12"
              width="1"
            />
            <span v-else>{{ privateAccommodationsAllowanceUS }}</span>
            per night (In Alaska and rest of USA)
          </p>
        </li>
      </ul>
      <p class="mt-4">
        Refer to
        <a
          href="https://www.njc-cnm.gc.ca/directive/app_d.php?lang=en"
          target="_blank"
          >Canada's National Joint Council travel directive, Appendix D</a
        >.
      </p>
      <p></p
    ></v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue"
import { isNil } from "lodash"

import formatCurrency from "@/utils/format-currency"
import { MAX_PER_PAGE } from "@/api/base-api"
import usePerDiems, { PER_DIEM_CLAIM_TYPES, PER_DIEM_TRAVEL_REGIONS } from "@/use/use-per-diems"

// TODO: consider if we should be doing a separate query for each region
const perDiemsQuery = computed(() => {
  return {
    where: {
      claimType: PER_DIEM_CLAIM_TYPES.PRIVATE_ACCOMMODATIONS,
    },
    perPage: MAX_PER_PAGE,
  }
})
const { perDiems, isLoading } = usePerDiems(perDiemsQuery)

const privateAccommodationsAllowanceCanada = computed(() => {
  const privateAccommodationsCanada = perDiems.value.find(
    (perDiem) => perDiem.travelRegion === PER_DIEM_TRAVEL_REGIONS.CANADA
  )
  if (isNil(privateAccommodationsCanada)) {
    return "???"
  }

  const { amount, currency } = privateAccommodationsCanada
  return formatCurrency(amount, currency)
})
const privateAccommodationsAllowanceUS = computed(() => {
  const privateAccommodationsUS = perDiems.value.find(
    (perDiem) => perDiem.travelRegion === PER_DIEM_TRAVEL_REGIONS.US
  )
  if (isNil(privateAccommodationsUS)) {
    return "???"
  }

  const { amount, currency } = privateAccommodationsUS
  return formatCurrency(amount, currency)
})
</script>
