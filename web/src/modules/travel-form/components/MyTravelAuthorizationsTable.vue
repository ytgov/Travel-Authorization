<template>
  <div>
    <pre>{{ myForms }}</pre>
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
      <template #item.departure-date="{ item }">
        <span>{{ formatAsDate(item.departingAt) }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"

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
        value: "location",
      },
      {
        text: "Description",
        value: "description",
      },
      {
        text: "Start Date",
        value: "startDate",
      },
      {
        text: "End Date",
        value: "endDate",
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
      const timestamp = Date.parse(value)
      if (isNaN(timestamp)) return value

      const date = new Date(timestamp)
      return date.toDateString()
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
