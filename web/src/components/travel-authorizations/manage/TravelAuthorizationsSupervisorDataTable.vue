<template>
  <v-data-table
    :headers="headers"
    :items="travelAuthorizations"
    :loading="isLoading"
    :items-per-page.sync="perPage"
    :page.sync="page"
    :server-items-length="totalCount"
    class="elevation-2"
    @click:row="goToManageTravelAuthorization"
  >
    <template #item.departmentAndBranch="{ item }">
      <span>{{ formatDepartmentAndBranch(item) }}</span>
    </template>
    <template #item.name="{ item }">
      <span>{{ item.firstName }} {{ item.lastName }}</span>
    </template>
    <template #item.departingAt="{ value }">
      <span>{{ formatDate(value) }}</span>
    </template>
    <template #item.returningAt="{ value }">
      <span>{{ formatDate(value) }}</span>
    </template>
  </v-data-table>
</template>

<script setup>
import { computed, ref } from "vue"
import { isNil } from "lodash"
import { DateTime } from "luxon"

import useRouteQuery from "@/use/utils/use-route-query"
import useCurrentUser from "@/use/use-current-user"
import useTravelAuthorizations from "@/use/use-travel-authorizations"

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
    text: "TA Form Number",
    value: "id",
  },
  {
    text: "Department/Branch",
    value: "departmentAndBranch",
  },
  {
    text: "Requestee",
    value: "name",
  },
  {
    text: "Departure Date",
    value: "departingAt",
  },
  {
    text: "Return Date",
    value: "returningAt",
  },
])

const page = useRouteQuery(`page${props.routeQuerySuffix}`, 1, {
  get: (value) => parseInt(value, 10),
  set: (value) => value.toString(),
})
const perPage = useRouteQuery(`perPage${props.routeQuerySuffix}`, 10, {
  get: (value) => parseInt(value, 10),
  set: (value) => value.toString(),
})

const { currentUser } = useCurrentUser()

const travelAuthorizationsQuery = computed(() => {
  return {
    where: {
      ...props.where,
      supervisorEmail: currentUser.value.email,
    },
    filters: props.filters,
    page: page.value,
    perPage: perPage.value,
  }
})
const { travelAuthorizations, totalCount, isLoading, refresh } =
  useTravelAuthorizations(travelAuthorizationsQuery)

function formatDepartmentAndBranch(item) {
  return [item.department, item.branch].filter(Boolean).join("/")
}

function formatDate(value) {
  if (isNil(value)) return "Unknown"

  const date = DateTime.fromISO(value, { zone: "utc" })
  return date.toFormat("dd-LLL-yyyy")
}

function goToManageTravelAuthorization(travelAuthorization) {
  const travelAuthorizationId = travelAuthorization.id
  this.$router.push({
    name: "ManageTravelAuthorizationDetailsPage",
    params: {
      travelAuthorizationId,
    },
  })
}

defineExpose({
  refresh,
})
</script>
