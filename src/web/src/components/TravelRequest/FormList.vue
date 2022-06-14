<template>
  <div class="user">
    <h1>Submitted Forms</h1>
    <v-card class="mt-5" color="#fff2d5">
      <v-card-title>Travel Requests</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="forms"
          :items-per-page="20"
          class="elevation-1"
          @click:row="openForm"
        >
          <template v-slot:item.datebacktowork="{ item }">
            <span>{{ new Date(item.datebacktowork).toDateString() }}</span>
          </template>
          <template v-slot:item.departureDate="{ item }">
            <span>{{ new Date(item.departureDate).toDateString() }}</span>
          </template></v-data-table
        ><v-btn to="/TravelRequest/Request" color="success"
          >New Travel Request</v-btn
        ></v-card-text
      >
    </v-card>
  </div>
</template> 
<script>
import axios from "axios";
import { FORM_URL } from "../../urls";
export default {
  name: "Home",
  data: () => ({
    forms: [],
    headers: [
      { text: "TA Form Number", value: "taid" },
      { text: "Department/Branch", value: "department" },
      { text: "Purpose", value: "purpose" },
      { text: "Departure Date", value: "departureDate" },
      { text: "Return Date", value: "datebacktowork" },
      { text: "Status", value: "formstatus" },
    ],
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
      this.$router.push(`/TravelRequest/Request/${value.formid}`);
    },
  },
};
</script>