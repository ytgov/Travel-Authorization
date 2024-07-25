<template>
  <v-card>
    <v-card-title>
      <h3>Per-Diems</h3>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="perDiemsAsMatrix"
      :loading="isLoading"
    >
      <template #top>
        <EditPerDiemDialog
          ref="editDialog"
          @saved="refresh"
        />
      </template>
      <template #item.claimType="{ value }">
        {{ t(`per_diem.claim_type.${value}`, { $default: value }) }}
      </template>
      <template #item.yukonAndAlaska="{ item }">
        <template
          v-if="item[PER_DIEM_TRAVEL_REGIONS.YUKON] === item[PER_DIEM_TRAVEL_REGIONS.ALASKA]"
        >
          {{ formatCurrency(item[PER_DIEM_TRAVEL_REGIONS.YUKON], "CAD") }}
        </template>
        <template v-else>
          {{
            [
              formatCurrency(item[PER_DIEM_TRAVEL_REGIONS.YUKON], "CAD"),
              formatCurrency(item[PER_DIEM_TRAVEL_REGIONS.ALASKA], "USD"),
            ].join(" / ")
          }}
        </template>
      </template>
      <template #item.nwt="{ item }">
        {{ formatCurrency(item[PER_DIEM_TRAVEL_REGIONS.NWT], "CAD") }}
      </template>
      <template #item.nunavut="{ item }">
        {{ formatCurrency(item[PER_DIEM_TRAVEL_REGIONS.NUNAVUT], "CAD") }}
      </template>
      <template #item.restOfCanada="{ item }">
        {{ formatCurrency(item[PER_DIEM_TRAVEL_REGIONS.CANADA], "CAD") }}
      </template>
      <template #item.restOfUsa="{ item }">
        {{ formatCurrency(item[PER_DIEM_TRAVEL_REGIONS.US], "USD") }}
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex justify-end">
          <v-btn
            title="Edit"
            icon
            color="blue"
            @click="showEditDialog(item)"
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue"
import { groupBy, mapValues } from "lodash"
import { useI18n } from "@/plugins/vue-i18n-plugin"

import { MAX_PER_PAGE } from "@/api/base-api"
import usePerDiems, { PER_DIEM_TRAVEL_REGIONS } from "@/use/use-per-diems"

import EditPerDiemDialog from "@/components/per-diems/EditPerDiemDialog.vue"

/**
 * @template [T=any]
 * @typedef {import("vue").Ref<T>} Ref
 */

const { t } = useI18n()

const headers = ref([
  {
    text: "",
    value: "claimType",
  },
  {
    text: "Yukon/Alaska",
    value: "yukonAndAlaska",
  },
  {
    text: "NWT",
    value: "nwt",
  },
  {
    text: "Nunavut",
    value: "nunavut",
  },
  {
    text: "Rest of Canada",
    value: "restOfCanada",
  },
  {
    text: "Rest of USA",
    value: "restOfUsa",
  },
  {
    text: "",
    value: "actions",
  },
])

const perDiemsQuery = computed(() => ({
  perPage: MAX_PER_PAGE,
}))
const { perDiems, isLoading, refresh } = usePerDiems(perDiemsQuery)

const perDiemsAsMatrix = computed(() => {
  const perDiemsByClaimType = groupBy(perDiems.value, "claimType")
  const matrix = mapValues(perDiemsByClaimType, (items, claimType) => {
    const row = { claimType }
    items.forEach(({ amount, travelRegion }) => {
      row[travelRegion] = amount
    })
    return row
  })

  return Object.values(matrix)
})

/** @type {Ref<InstanceType<typeof EditPerDiemDialog> | null>} */
const editDialog = ref(null)

function showEditDialog(flightRequest) {
  editDialog.value?.show(flightRequest)
}

function formatCurrency(amount, currency = "CAD") {
  if (amount === undefined) {
    return ""
  }

  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  })
  return formatter.format(amount)
}
</script>

<style scoped></style>
