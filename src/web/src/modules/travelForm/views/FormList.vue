<template>
  <div class="user">
    <h1>My Travel</h1>
    <v-card class="mt-5" color="#fff2d5">
      <v-card-text>
        <div style="height: 55px">
          <v-btn @click="createForm()" color="primary" class="float-right my-0">
            + Travel Authorization
          </v-btn>
        </div>
        <v-data-table :headers="headers" :items="forms" :items-per-page="20" class="elevation-2" @click:row="openForm">
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
// import { FORM_URL } from "@/urls";
import { v4 as uuidv4 } from "uuid";
// import { secureGet } from "@/store/jwt";
import { mapActions } from "vuex";
export default {
  name: "Home",
  data: () => ({
    forms: [],
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
  created() {
    this.loadForms();
  },
  methods: {
    ...mapActions("travelForm", ["loadForms"]),
    openForm(value) {
      this.$router.push(`/my-travel-requests/${value.formId}`);
    },
    createForm() {
      this.$router.push(`/my-travel-requests/${uuidv4()}`);
    },
  },
};
</script>
