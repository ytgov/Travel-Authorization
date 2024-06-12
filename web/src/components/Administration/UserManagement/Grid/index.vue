<template>
  <div>
    <!-- <v-btn color="secondary" class="float-right mb-0 mt-2 pl-2" to="/admin" exact style="height: auto; font-size: .8rem; padding: 6px 10px;"
      ><v-icon class="mr-2" small>mdi-arrow-left</v-icon> Back to Administration</v-btn
    > -->

    <Breadcrumbs />

    <h1>User Management</h1>
    <div class="mt-2">
      <v-card class="default px-3 py-3">
        <v-card-text>
          <v-row>
            <v-col
              cols="8"
              class="d-flex"
            >
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                background-color="white"
                outlined
                dense
                label="Search"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col
              cols="4"
              class="d-flex"
            >
              <v-select
                v-model="selectedFilter"
                small-chips
                multiple
                :items="filterOptions"
                label="Status filter"
                dense
                outlined
                background-color="white"
                hide-details
              ></v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto"> </v-col>
          </v-row>

          <v-data-table
            :items="filteredData"
            :headers="headers"
            :loading="loading"
            :search="search"
            :footer-props="{
              'items-per-page-options': [10, 30, 100],
            }"
            class="clickable-row"
            @click:row="handleClick"
          >
          </v-data-table
        ></v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"

import { USERS_URL } from "@/urls"
import { secureGet } from "@/store/jwt"
import Breadcrumbs from "@/components/Breadcrumbs.vue"

export default {
  name: "UsersGrid",
  components: {
    Breadcrumbs,
  },
  data: () => ({
    loading: false,
    users: [],
    search: "",
    options: {},
    totalLength: 0,
    headers: [
      {
        text: "Email",
        value: "email",
      },
      {
        text: "First Name",
        value: "firstName",
      },
      {
        text: "Last Name",
        value: "lastName",
      },
      {
        text: "Status",
        value: "isActive",
      },
      //      { text: "Actions", value: "actions"}
    ],
    page: 1,
    pageCount: 0,
    iteamsPerPage: 10,
    selectedFilter: ["Active"],
    filterOptions: ["Active", "Expired", "Inactive"],
  }),
  computed: {
    filteredData() {
      if (this.selectedFilter.length == 0) return this.users

      let data = []
      for (let usr of this.users) {
        if (this.selectedFilter.indexOf("Active") >= 0) {
          if (usr.status == "active") data.push(usr)
        }
      }
      return data
    },
  },
  async mounted() {
    //this.getDataFromApi();
    this.laodUsers()
  },
  methods: {
    ...mapActions("users", ["loadUsers"]),

    handleClick(value) {
      //Redirects the user to the edit user form
      this.$router.push(`/administration/users/edit/${value.id}`)
    },
    laodUsers() {
      secureGet(`${USERS_URL}`).then((resp) => {
        this.users = resp.data
      })
    },
  },
}
</script>

<style scoped>
.hoverclicklink:hover {
  color: #0097a9;
  text-decoration: underline;
  cursor: pointer;
}
</style>
