<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="20"
    class="elevation-2"
    @click:row="goToManageTravelAuthorization"
  >
    <template #item.name="{ item }">
      <span>{{ item.firstName }} {{ item.lastName }}</span>
    </template>
    <template #item.dateBackToWork="{ value }">
      <span>{{ formatDate(value) }}</span>
    </template>
    <template #item.departureDate="{ value }">
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
        value: "department",
      },
      {
        text: "Requestee",
        value: "name",
      },
      {
        text: "Departure Date",
        value: "departureDate",
      },
      {
        text: "Return Date",
        value: "dateBackToWork",
      },
    ],
  }),
  computed: {
    ...mapState("currentUser", { currentUser: "attributes" }),
  },
  async mounted() {
    // TODO: move current user initialization to a higher level
    await this.initializeCurrentUser()
    await travelAuthorizationsApi.list({
      where: {
        status: this.status,
        supervisorEmail: this.currentUser.email,
      },
    })
  },
  methods: {
    ...mapActions("currentUser", { initializeCurrentUser: "initialize" }),
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
