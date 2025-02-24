<template>
  <v-data-table
    :page.sync="page"
    :items-per-page.sync="perPage"
    :sort-by.sync="vuetify2SortBy"
    :sort-desc.sync="vuetify2SortDesc"
    :items="accountsReceivableInvoiceDetails"
    :headers="headers"
    :server-items-length="totalCount"
    :loading="isLoading"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #top="slotProps">
      <slot
        name="top"
        v-bind="slotProps"
      ></slot>
    </template>
    <template #item.invoice.bookingDate="{ value }">
      {{ formatDate(value) }}
    </template>
    <template #item.sellingFare="{ value }"> {{ formatCurrency(value) }} </template>

    <template #item.agentName="{ value }">
      {{ capitalize(value) }}
    </template>

    <template #item.vendorName="{ value }">
      {{ capitalize(value) }}
    </template>

    <template #item.flightInfo="{ item }">
      <div
        v-for="(flight, index) in item.flightInfo?.split(',')"
        :key="'flight-info-' + index"
      >
        {{ flight }}
      </div>
    </template>
    <template #item.invoice.reconciled="{ value }">
      <v-chip
        v-if="value"
        color="success"
        text-color="white"
        size="small"
      >
        Yes
      </v-chip>
      <v-chip
        v-else
        color="warning"
        text-color="white"
        size="small"
      >
        No
      </v-chip>
    </template>
  </v-data-table>
</template>

<script setup>
import { computed } from "vue"
import { isNil } from "lodash"

import { capitalize, formatCurrency, formatDate } from "@/utils/formatters"

import useRouteQuery, { integerTransformer } from "@/use/utils/use-route-query"
import useVuetifySortByToSafeRouteQuery from "@/use/utils/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/utils/use-vuetify-sort-by-to-sequelize-safe-order"
import useVuetify2SortByShim from "@/use/utils/use-vuetify2-sort-by-shim"
import useAccountsReceivableInvoiceDetails from "@/use/trav-com/use-accounts-receivable-invoice-details"

const props = defineProps({
  where: {
    type: Object,
    default: () => ({}),
  },
  filters: {
    type: Object,
    default: () => ({}),
  },
  routeQuerySuffix: {
    type: String,
    default: "",
  },
  reconciled: {
    type: Boolean,
    default: null,
  },
})

const headers = computed(() => {
  const baseHeaders = [
    {
      text: "Purchase Date",
      value: "invoice.bookingDate",
      sortable: false,
      width: "9rem",
    },
    {
      text: "Cost",
      value: "sellingFare",
      width: "7rem",
    },
    {
      text: "Agent",
      value: "agentName", // from includeAgentNameAttribute scope
      width: "10rem",
    },
    {
      text: "Airline",
      value: "vendorName",
      width: "10rem",
    },
    {
      text: "Flight Info",
      value: "flightInfo",
      sortable: false,
    },
    {
      text: "Final Destination",
      value: "finalDestination",
      sortable: false,
      width: "10rem",
    },
    {
      text: "Department",
      value: "department",
      sortable: false,
    },
    {
      text: "Traveler First Name",
      value: "travelerFirstName",
      sortable: false,
      width: "11rem",
    },
    {
      text: "Traveler Last Name",
      value: "travelerLastName",
      sortable: false,
      width: "11rem",
    },
  ]

  if (isNil(props.reconciled)) {
    baseHeaders.push({
      text: "Reconciled",
      value: "invoice.reconciled",
      sortable: false,
      align: "center",
    })
  } else if (props.reconciled === true) {
    baseHeaders.push({
      text: "Reconcile Period",
      value: "reconcilePeriod",
      sortable: false,
    })
  } else {
    // no-op
  }

  return baseHeaders
})

const page = useRouteQuery(`page${props.routeQuerySuffix}`, "1", {
  transform: integerTransformer,
})
const perPage = useRouteQuery(`perPage${props.routeQuerySuffix}`, "10", {
  transform: integerTransformer,
})
const sortBy = useVuetifySortByToSafeRouteQuery(`sortBy${props.routeQuerySuffix}`, [
  // TODO: consider sorting by invoice.bookingDate instead.
  {
    key: "travelDate",
    order: "desc",
  },
])
const { vuetify2SortBy, vuetify2SortDesc } = useVuetify2SortByShim(sortBy)
const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const accountsReceivableInvoiceDetailsQuery = computed(() => ({
  where: props.where,
  filters: props.filters,
  order: order.value,
  page: page.value,
  perPage: perPage.value,
}))
const { accountsReceivableInvoiceDetails, totalCount, isLoading, refresh } =
  useAccountsReceivableInvoiceDetails(accountsReceivableInvoiceDetailsQuery)

defineExpose({
  refresh,
})
</script>
