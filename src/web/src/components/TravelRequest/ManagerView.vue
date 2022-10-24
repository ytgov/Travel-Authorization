<template>
  <div class="user">
    <h1>Manage Submissions</h1>
    <v-row>
      <v-col>
        <v-card class="mt-5" color="#fff2d5">
          <v-card-title>Pending Approvals</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="pending"
              :items-per-page="20"
              class="elevation-1"
              @click:row="handleClick"
            >
              <template v-slot:item.name="{ item }">
                <span>{{ item.firstName }} {{ item.lastName }}</span>
              </template>
              <template v-slot:item.dateBackToWork="{ item }">
                <span>{{ new Date(item.dateBackToWork).toDateString() }}</span>
              </template>
              <template v-slot:item.departureDate="{ item }">
                <span>{{ new Date(item.departureDate).toDateString() }}</span>
              </template></v-data-table
            >
          </v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <v-card class="mt-5" color="#fff2d5">
          <v-card-title>Awaiting changes</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="changeRequests"
              :items-per-page="20"
              class="elevation-1"
              @click:row="handleClick"
            >
              <template v-slot:item.name="{ item }">
                <span>{{ item.firstName }} {{ item.lastName }}</span>
              </template>
              <template v-slot:item.dateBackToWork="{ item }">
                <span>{{ new Date(item.dateBackToWork).toDateString() }}</span>
              </template>
              <template v-slot:item.departureDate="{ item }">
                <span>{{ new Date(item.departureDate).toDateString() }}</span>
              </template></v-data-table
            ></v-card-text
          >
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="mt-5" color="#fff2d5">
          <v-card-title>Awaiting Expense Approval</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="pending"
              :items-per-page="20"
              class="elevation-1"
              @click:row="handleClick"
            >
              <template v-slot:item.name="{ item }">
                <span>{{ item.firstName }} {{ item.lastName }}</span>
              </template>
              <template v-slot:item.dateBackToWork="{ item }">
                <span>{{ new Date(item.dateBackToWork).toDateString() }}</span>
              </template>
              <template v-slot:item.departureDate="{ item }">
                <span>{{ new Date(item.departureDate).toDateString() }}</span>
              </template></v-data-table
            >
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
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
              <template v-slot:item.name="{ item }">
                <span>{{ item.firstName }} {{ item.lastName }}</span>
              </template>
              <template v-slot:item.dateBackToWork="{ item }">
                <span>{{ new Date(item.dateBackToWork).toDateString() }}</span>
              </template>
              <template v-slot:item.departureDate="{ item }">
                <span>{{ new Date(item.departureDate).toDateString() }}</span>
              </template></v-data-table
            ></v-card-text
          >
        </v-card>
      </v-col>
    </v-row>
  </div>
</template> 
<script>
import axios from "axios";
import { MANAGER_URL } from "../../urls";
export default {
  name: "Home",
  data: () => ({
    forms: [],
    pending: [],
    approved: [],
    changeRequests: [],
    headers: [
      { text: "TA Form Number", value: "id" },
      { text: "Department/Branch", value: "department" },
      { text: "Requestee", value: "name" },
      { text: "Departure Date", value: "departureDate" },
      { text: "Return Date", value: "dateBackToWork" },
    ],
  }),
  created() {
    this.loadForms();
  },
  methods: {
    loadForms() {
      axios.get(`${MANAGER_URL}/forms/`).then((resp) => {
        this.forms = resp.data;
        this.pending = this.forms.filter((form) => {
          if (form.formStatus == "Submitted") return true;
        });
        this.approved = this.forms.filter((form) => {
          if (form.formStatus == "Approved") return true;
        });
        this.changeRequests = this.forms.filter((form) => {
          if (form.formStatus == "Change Requested") return true;
        });
      });
    },
    handleClick(value) {
      //Redirects the user to the edit user form
      this.$router.push(`/TravelRequest/Request/${value.formId}/manage`);
    },
  },
};
</script>