<template>
  <div class="user">
    <h1>Manage Submissions</h1>
    <v-card class="mt-5" color="#fff2d5">
      <v-card-title>Pending Approvals</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="pending"
          :items-per-page="20"
          class="elevation-1"
        >
          <template v-slot:item.firstname="{ item }">
            <span>{{ item.firstname }} {{ item.lastname }}</span>
          </template>
          <template v-slot:item.datebacktowork="{ item }">
            <span>{{ new Date(item.datebacktowork).toDateString() }}</span>
          </template>
          <template v-slot:item.departureDate="{ item }">
            <span>{{ new Date(item.departureDate).toDateString() }}</span>
          </template></v-data-table
        >
      </v-card-text>
    </v-card>
    <v-card class="mt-5" color="#fff2d5">
      <v-card-title>Approved Trips</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="approved"
          :items-per-page="20"
          class="elevation-1"
          @click:row="handleClick"
        >
          <template v-slot:item.firstname="{ item }">
            <span>{{ item.firstname }} {{ item.lastname }}</span>
          </template>
          <template v-slot:item.datebacktowork="{ item }">
            <span>{{ new Date(item.datebacktowork).toDateString() }}</span>
          </template>
          <template v-slot:item.departureDate="{ item }">
            <span>{{ new Date(item.departureDate).toDateString() }}</span>
          </template></v-data-table
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
    pending: [],
    approved: [],
    headers: [
      { text: "TA Form Number", value: "taid" },
      { text: "Department/Branch", value: "department" },
      { text: "Requestee", value: "firstname" },
      { text: "Departure Date", value: "departureDate" },
      { text: "Return Date", value: "datebacktowork" },
    ],
  }),
  created() {
    this.loadForms();
  },
  methods: {
    loadForms() {
      axios.get(`${FORM_URL}`).then((resp) => {
        this.forms = resp.data;
        this.pending = this.forms.filter((form) => {
          if (form.formstatus == "Draft") return true;
        });
        this.approved = this.forms.filter((form) => {
          if (form.formstatus != "Draft") return true;
        });
      });
    },
    handleClick(value) {
      //Redirects the user to the edit user form
      this.$router.push(`/managerView/forms/view/${value.taid}`);
    },
  },
};
</script>