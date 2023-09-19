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
            @click="goToCreateForm"
            color="primary"
            class="float-right my-0"
          >
            + Travel Authorization
          </v-btn>
        </div>
        <v-data-table
          :headers="headers"
          :items="myForms"
          :items-per-page="20"
          class="elevation-2"
          @click:row="goToFormDetails"
        >
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

export default {
  name: "Home",
  data: () => ({
    headers: [
      {
        text: "Department/Branch",
        value: "department",
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
  }),
  mounted() {
    this.loadForms()
  },
  computed: {
    ...mapState("travelForm", ["myForms"]),
  },
  methods: {
    ...mapActions("travelForm", ["loadForms"]),
    goToFormDetails(form) {
      const formId = form.id
      this.$router.push({ name: "travelRequestEdit", params: { formId } })
    },
    goToCreateForm() {
      this.$router.push({ name: "travelRequestCreate" })
    },
    formatAsDate(value) {
      const timestamp = Date.parse(value)
      if (isNaN(timestamp)) return value

      const date = new Date(timestamp)
      return date.toDateString()
    },
  },
}
</script>
