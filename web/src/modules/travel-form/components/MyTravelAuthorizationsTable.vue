<template>
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
    <template #item.department-and-branch="{ item }">
      <span>{{ formatDepartmentAndBranch(item) }}</span>
    </template>
    <template #item.departure-date="{ item }">
      <span>{{ formatAsDate(item.departingAt) }}</span>
    </template>
    <template #item.date-back-to-work="{ item }">
      <span>{{ formatAsDate(item.dateBackToWork) }}</span>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { isEmpty } from "lodash"

export default {
  name: "MyTravelAuthorizationsTable",
  data: () => ({
    headers: [
      {
        text: "Department/Branch",
        value: "departmentAndBranch",
      },
      {
        text: "Purpose",
        value: "purpose",
      },
      {
        text: "Departure Date",
        value: "departureDate",
      },
      {
        text: "Return Date",
        value: "dateBackToWork",
      },
      {
        text: "Status",
        value: "status",
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
      const timestamp = Date.parse(value)
      if (isNaN(timestamp)) return value

      const date = new Date(timestamp)
      return date.toDateString()
    },
    formatDepartmentAndBranch(item) {
      const { department, branch } = item
      if (isEmpty(branch)) return department
      if (branch === department) return department

      return `${department} - ${branch}`
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
