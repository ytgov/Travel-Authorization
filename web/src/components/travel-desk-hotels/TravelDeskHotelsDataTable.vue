<template>
  <v-data-table
    :page.sync="page"
    :items-per-page.sync="perPage"
    :sort-by.sync="vuetify2SortBy"
    :sort-desc.sync="vuetify2SortDesc"
    :headers="headers"
    :items="travelDeskHotels"
    :server-items-length="totalCount"
    :loading="isLoading"
  >
    <template #top="slotProps"
      ><slot
        name="top"
        v-bind="slotProps"
      ></slot
    ></template>
    <template #item.isDedicatedConferenceHotelAvailable="{ item }">
      {{ item.isDedicatedConferenceHotelAvailable ? "Yes" : "No" }}
    </template>

    <template #item.checkIn="{ item }">
      {{ formatDate(item.checkIn) }}
    </template>

    <template #item.checkOut="{ item }">
      {{ formatDate(item.checkOut) }}
    </template>

    <!-- TODO: add "view" action -->
    <template #item.actions="slotProps"
      ><slot
        name="item.actions"
        v-bind="slotProps"
      ></slot
    ></template>
  </v-data-table>
</template>

<script setup>
import { computed, ref } from "vue"

import formatDate from "@/utils/format-date"
import useRouteQuery, { integerTransformerLegacy } from "@/use/utils/use-route-query"
import useVuetifySortByToSafeRouteQuery from "@/use/utils/use-vuetify-sort-by-to-safe-route-query"
import useVuetifySortByToSequelizeSafeOrder from "@/use/utils/use-vuetify-sort-by-to-sequelize-safe-order"
import useVuetify2SortByShim from "@/use/utils/use-vuetify2-sort-by-shim"
import useTravelDeskHotels from "@/use/use-travel-desk-hotels"

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
})

const headers = ref([
  {
    text: "Check-in",
    value: "checkIn",
  },
  {
    text: "Check-out",
    value: "checkOut",
  },
  {
    text: "City",
    value: "city",
    sortable: false,
  },
  {
    text: "Conference Hotel?",
    value: "isDedicatedConferenceHotelAvailable",
    sortable: false,
  },
  {
    text: "Conference/Meeting Name",
    value: "conferenceName",
    sortable: false,
  },
  {
    text: "Conference/Meeting Hotel",
    value: "conferenceHotelName",
    sortable: false,
  },
  {
    text: "Additional Information",
    value: "additionalInformation",
    sortable: false,
  },
  {
    text: "Actions",
    value: "actions",
    align: "end",
    sortable: false,
  },
])

const page = useRouteQuery(`page${props.routeQuerySuffix}`, 1, {
  transform: integerTransformerLegacy,
})
const perPage = useRouteQuery(`perPage${props.routeQuerySuffix}`, 5, {
  transform: integerTransformerLegacy,
})
const sortBy = useVuetifySortByToSafeRouteQuery("sortBy", [
  {
    key: "checkIn",
    order: "asc",
  },
])
const { vuetify2SortBy, vuetify2SortDesc } = useVuetify2SortByShim(sortBy)
const order = useVuetifySortByToSequelizeSafeOrder(sortBy)

const travelDeskHotelsQuery = computed(() => ({
  where: props.where,
  filters: props.filters,
  order: order.value,
  page: page.value,
  perPage: perPage.value,
}))
const { travelDeskHotels, totalCount, isLoading, refresh } =
  useTravelDeskHotels(travelDeskHotelsQuery)

defineExpose({
  refresh,
})
</script>
