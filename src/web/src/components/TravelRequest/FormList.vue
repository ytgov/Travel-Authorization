<template>
  <div class="user">
    <v-breadcrumbs
      :items="[
        { text: 'Administration Home', exact: true, to: '/administration' },
        { text: 'Users', exact: true },
      ]"
    ></v-breadcrumbs>
    <h1>Submitted Forms</h1>
    <v-card class="default">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="users"
          :items-per-page="20"
          class="elevation-1"
          @click:row="editUser"
        ></v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template> 
<script>
import axios from "axios";
import { USERS_URL } from "../../urls";
export default {
  data() {
    return {
      headers: [
        { text: "TA Form Number", value: "first_name" },
        { text: "Department/Branch", value: "last_name" },
        { text: "Supervisor", value: "email" },
        { text: "Location(s)", value: "status" },
        { text: "Departure Date", value: "roles" },
        { text: "Return Date", value: "roles" },
      ],
      users: [],
    };
  },
  created() {
    this.loadForms();
  },
  methods: {
    loadUsers() {
      console.log(`${USERS_URL}`);
      axios.get(`${USERS_URL}`).then((resp) => {
        this.users = resp.data.data;
        console.log(this.users);
      });
    },
    editUser(user) {
      this.$router.push(`/administration/userList/${user.id}`);
    },
  },
};
</script>