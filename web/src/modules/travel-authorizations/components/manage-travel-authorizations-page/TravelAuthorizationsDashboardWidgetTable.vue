<template>
  <v-data-table
    :headers="headers"
    :items="items"
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

<script>
import { isNil } from "lodash"
import { DateTime } from "luxon"
import { mapActions, mapState } from "vuex"

import travelAuthorizationsApi from "@/api/travel-authorizations-api"

export default {
  name: "TravelAuthorizationsDashboardWidgetTable",
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    items: [],
    headers: [
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
    ],
    isLoading: false,
    totalCount: 0,
    perPage: 10,
    page: 1,
  }),
  computed: {
    ...mapState("currentUser", { currentUser: "attributes" }),
  },
  watch: {
    page() {
      this.refresh()
    },
    perPage() {
      this.refresh()
    },
  },
  async mounted() {
    // TODO: move current user initialization to a higher level
    await this.initializeCurrentUser()
    await this.refresh()
  },
  methods: {
    ...mapActions("currentUser", { initializeCurrentUser: "initialize" }),
    refresh() {
      this.isLoading = true
      return travelAuthorizationsApi
        .list({
          where: {
            status: this.status,
            supervisorEmail: this.currentUser.email,
          },
          page: this.page,
          perPage: this.perPage,
        })
        .then(({ travelAuthorizations, totalCount }) => {
          this.items = travelAuthorizations
          this.totalCount = totalCount
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    formatDepartmentAndBranch(item) {
      return [item.department, item.branch].filter(Boolean).join("/")
    },
    formatDate(value) {
      if (isNil(value)) return "Unknown"

      const date = DateTime.fromISO(value, { zone: "utc" })
      return date.toFormat("dd-LLL-yyyy")
    },
    goToManageTravelAuthorization(travelAuthorization) {
      const formId = travelAuthorization.id
      this.$router.push({ name: "TravelFormManage", params: { formId } })
    },
  },
}
</script>
