<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="myForms"
      :loading="loadingForms"
      :items-per-page.sync="perPage"
      :page.sync="page"
      :server-items-length="totalCount"
      class="elevation-2"
      @click:row="goToFormDetails"
    >
      <template #item.finalDestination="{ value }">
        <span>{{ formatAsLocation(value) }}</span>
      </template>
      <template #item.departingAt="{ value }">
        <span>{{ formatAsDate(value) }}</span>
      </template>
      <template #item.returningAt="{ value }">
        <span>{{ formatAsDate(value) }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { isNil } from "lodash"
import { DateTime } from "luxon"

export default {
  name: "MyTravelAuthorizationsTable",
  data: () => ({
    headers: [
      {
        text: "Phase",
        value: "phase",
      },
      {
        text: "Location",
        value: "finalDestination",
      },
      {
        text: "Description",
        value: "eventName",
      },
      {
        text: "Start Date",
        value: "departingAt",
      },
      {
        text: "End Date",
        value: "returningAt",
      },
      {
        text: "Travel Auth Status",
        value: "status",
      },
      {
        text: "Travel Action",
        value: "action",
      },
    ],
    perPage: 10,
    page: 1,
    totalCount: 1,
    loadingForms: true,
  }),
  async mounted() {
    await this.refreshForms()
  },
  computed: {
    ...mapState("travelForm", ["myForms"]),
  },
  methods: {
    ...mapActions("travelForm", ["loadForms"]),
    refreshForms() {
      this.loadingForms = true
      return this.loadForms({ page: this.page, perPage: this.perPage })
        .then(({ totalCount }) => {
          this.totalCount = totalCount
        })
        .finally(() => {
          this.loadingForms = false
        })
    },
    goToFormDetails(form) {
      const formId = form.id
      this.$router.push({ name: "TravelFormEdit-DetailsTab", params: { formId } })
    },
    formatAsDate(value) {
      if (isNil(value)) return "Unknown"

      const date = DateTime.fromISO(value, { zone: "utc" })
      return date.toFormat("dd-LLL-yyyy")
    },
    formatAsLocation(value) {
      if (isNil(value) || isNil(value.city)) return "Unknown"

      return value.city
    },
  },
  watch: {
    page() {
      this.refreshForms()
    },
    perPage() {
      this.refreshForms()
    },
  },
}
</script>

<style scoped></style>
