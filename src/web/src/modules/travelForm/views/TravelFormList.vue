<template>
  <div class="user">
    <h1>My Travel</h1>
    <v-card
      class="mt-5"
      color="#fff2d5"
    >
      <v-card-text>
        <div style="height: 55px">
          <v-btn
            @click="createAndGoToFormDetails"
            color="primary"
            class="float-right my-0"
            :loading="loadingCreatingForm"
            :disabled="loadingCreatingForm"
          >
            + Travel Authorization
          </v-btn>
        </div>
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
          <template v-slot:item.departmentAndBranch="{ item }">
            <span>{{ formatDepartmentAndBranch(item) }}</span>
          </template>
          <template v-slot:item.departureDate="{ item }">
            <span>{{ formatAsDate(item.departingAt) }}</span>
          </template>
          <template v-slot:item.dateBackToWork="{ item }">
            <span>{{ formatAsDate(item.dateBackToWork) }}</span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex"
import { isEmpty } from "lodash"

export default {
  name: "TravelFormList",
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
    loadingCreatingForm: false,
  }),
  async mounted() {
    await this.refreshForms()
  },
  computed: {
    ...mapState("travelForm", ["myForms"]),
  },
  methods: {
    ...mapActions("travelForm", ["loadForms", "create"]),
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
    createAndGoToFormDetails() {
      this.loadingCreatingForm = true
      return this.create({ status: "Draft" })
        .then((form) => {
          return this.goToFormDetails(form)
        })
        .catch((error) => {
          this.$snack(error.response.message, { color: "error" })
        })
        .finally(() => {
          this.loadingCreatingForm = false
        })
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
