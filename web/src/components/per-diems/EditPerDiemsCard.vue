<template>
  <v-card>
    <v-card-title>
      <h3>Per-Diems</h3>
    </v-card-title>

    <v-data-table
      :page.sync="page"
      :items-per-page.sync="perPage"
      :headers="headers"
      :items="perDiems"
      :loading="isLoading"
      :server-items-length="totalCount"
      :footer-props="{
        'items-per-page-options': [6, 10, 15, -1],
      }"
      @dblclick:row="(_, { item }) => showEditDialog(item)"
    >
      <template #top>
        <EditPerDiemDialog
          ref="editPerDiemDialog"
          @saved="refresh"
        />
      </template>
      <template #item.claimType="{ value }">
        {{ t(`per_diem.claim_type.${value}`, { $default: value }) }}
      </template>
      <template #item.travelRegion="{ value }">
        {{ t(`per_diem.travel_region.${value}`, { $default: value }) }}
      </template>
      <template #item.amount="{ item, value }">
        {{ formatCurrency(value, item.currency) }}
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

import { useI18n } from "@/plugins/vue-i18n-plugin"
import useRouteQuery from "@/use/use-route-query"
import usePerDiems from "@/use/use-per-diems"

import EditPerDiemDialog from "@/components/per-diems/EditPerDiemDialog.vue"

/**
 * @template [T=any]
 * @typedef {import("vue").Ref<T>} Ref
 */

const { t } = useI18n()

const headers = ref([
  {
    text: "Claim Type",
    value: "claimType",
  },
  {
    text: "Travel Region",
    value: "travelRegion",
  },
  {
    text: "Amount",
    value: "amount",
  },
  {
    text: "",
    value: "actions",
  },
])

const page = useRouteQuery("perDiemsPage", "1", { transform: parseInt })
const perPage = useRouteQuery("perDiemsPerPage", "6", { transform: parseInt })

const perDiemsQuery = computed(() => ({
  page: page.value,
  perPage: perPage.value,
}))
const { perDiems, totalCount, isLoading, refresh } = usePerDiems(perDiemsQuery)

/** @type {Ref<InstanceType<typeof EditPerDiemDialog> | null>} */
const editPerDiemDialog = ref(null)

function showEditDialog(perDiem) {
  editPerDiemDialog.value?.show(perDiem)
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
