<template>
  <div class="home">
    <h1>Dashboard</h1>

    <v-card class="mt-5" color="#fff2d5">
      <v-card-title>Travel Requests</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="users"
          :items-per-page="20"
          class="elevation-1"
          @click:row="editUser"
        ></v-data-table
        ><v-btn to="/TravelRequest/request" color="success"
          >New Travel Request</v-btn
        ></v-card-text
      >
    </v-card>

    <div class="row">
      <div class="col-md-6">
        <v-card class="mt-5" color="#fff2d5">
          <v-card-title>Car Calendars</v-card-title>
          <v-card-text>List of cars will go here.</v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data: () => ({
    headers: [
      { text: "TA Form Number", value: "first_name" },
      { text: "Department/Branch", value: "last_name" },
      { text: "Supervisor", value: "email" },
      { text: "Location(s)", value: "status" },
      { text: "Departure Date", value: "roles" },
      { text: "Return Date", value: "roles" },
    ],
  }),
};
</script>
