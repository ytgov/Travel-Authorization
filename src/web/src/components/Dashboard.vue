<template>
  <div class="home">
    <h1>Dashboard</h1>

    <v-row>
      <v-col>
        <v-card class="mt-5" color="#fff2d5">
          <v-card-title>Trip Summaries</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="forms"
              hide-default-footer
              disable-pagination
              class="elevation-2"
              @click:row="openForm"
              style="margin: 20px"
            >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <v-card class="mt-5" color="#fff2d5">
          <v-card-title>Create a new travel request</v-card-title>
          <v-card-text>
            To begin the process of creating a new travel request, click the
            button bellow.</v-card-text
          >
          <v-card-actions>
            <v-btn @click="createForm()" color="blue">
              New Travel Request
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { FORM_URL } from "../urls";
import axios from "axios";

export default {
  name: "Home",
  data: () => ({
    headers: [
      { text: "Purpose", value: "purpose" },
      { text: "Departure Date", value: "departureDate" },
      { text: "Return Date", value: "dateBackToWork" },
      { text: "Status", value: "formStatus" },
    ],
    forms: [],
  }),
  created() {
    this.loadForms();
  },
  methods: {
    loadForms() {
      axios.get(`${FORM_URL}`).then((resp) => {
        this.forms = resp.data;
      });
    },
    openForm(value) {
      this.$router.push(`/TravelRequest/Request/${value.formId}`);
    },
    createForm() {
      this.$router.push(`/TravelRequest/Request/${uuidv4()}`);
    },
  },
};
</script>
