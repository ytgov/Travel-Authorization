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
          <template v-slot:item.datebacktowork="{ item }">
            <span>{{ new Date(item.dateBackToWork).toDateString() }}</span>
          </template>
          <template v-slot:item.departureDate="{ item }">
            <span>{{ new Date(item.departureDate).toDateString() }}</span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

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
        value: "datebacktowork",
      },
      {
        text: "Status",
        value: "status",
      },
    ],
  }),
  mounted() {
    this.loadForms();
  },
  computed: {
    ...mapState("travelForm", ["myForms"]),
  },
  methods: {
    ...mapActions("travelForm", ["loadForms"]),
    goToFormDetails(form) {
      this.$router.push({ name: "travelRequestsList", params: form.id });
    },
    goToCreateForm() {
      this.$router.push({ name: "travelRequestCreate" });
    },
  },
};
</script>
