<template>
  <div>
    <!-- <v-btn color="secondary" class="float-right mb-0 mt-2 pl-2" to="/admin/users" exact style="height: auto; font-size: .8rem; padding: 6px 10px;"
        ><v-icon class="mr-2" small>mdi-arrow-left</v-icon> Back to User Management</v-btn
        > -->
    <h1>
      User Editor:
      <small
        >{{ user.firstName }}
        {{ user.last_name }}

        <small>({{ user.status }})</small>
      </small>
    </h1>
    <Breadcrumbs />

    <v-row>
      <v-col
        cols="12"
        md="12"
      >
        <v-alert
          v-if="alertMsg"
          :color="alertType + ' accent-4'"
          dense
          dark
          dismissible
          >{{ alertMsg }}</v-alert
        >
        <v-card class="default">
          <v-card-title>User Details</v-card-title>
          <v-card-text>
            <v-form>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="user.firstName"
                    label="First name"
                    dense
                    outlined
                    background-color="white"
                    required
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="user.lastName"
                    label="Last name"
                    dense
                    outlined
                    background-color="white"
                    required
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="user.email"
                    label="Email"
                    dense
                    outlined
                    background-color="white"
                    required
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    :items="departments"
                    item-text="name"
                    v-model="pendingDepartments"
                    label="Departments"
                    outlined
                    dense
                    small-chips
                    clearable
                    background-color="white"
                    hide-details
                    @change="alertMsg = ''"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="pendingRoles"
                    label="Roles"
                    :items="roles"
                    outlined
                    dense
                    multiple
                    small-chips
                    background-color="white"
                    clearable
                    item-value="id"
                    item-text="name"
                    hide-details
                    @change="alertMsg = ''"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
            <v-row class="mt-5">
              <v-col
                cols="12"
                class="d-flex py-0"
              >
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  class="mr-5 mt-0"
                  @click="saveUser"
                >
                  Save user
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { secureGet, securePut } from "@/store/jwt"
import { USERS_URL, LOOKUP_URL } from "@/urls"
import Breadcrumbs from "@/components/Breadcrumbs.vue"

export default {
  components: {
    Breadcrumbs,
  },
  data: () => ({
    overlay: false,
    accessItem: {
      AccessType: 1,
      AccessText: 1,
    },
    /* VALIDATION*/
    dataAccessValidation: false,
    menu: null,

    rules: [(value) => !!value || "Required."],

    user: {
      first_name: "",
      last_name: "",
      email: "",
      roles: [],
    },

    pendingRoles: [],
    pendingDepartments: ["Employee"],
    pendingBranches: [],

    departments: [],
    branches: [],
    roles: [],
    showAccessDialog: false,
    alertMsg: "",
    alertType: "",
  }),
  async mounted() {
    await this.loadDepartments()
    await this.loadRoles()
    await this.loadUser(this.$route.params.id)
  },

  methods: {
    async saveUser() {
      this.alertMsg = ""
      this.alertType = "red"
      let permsObject = {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        departments: this.pendingDepartments,
        roles: this.pendingRoles,
      }
      securePut(`${USERS_URL}/${this.$route.params.id}/permissions`, permsObject)
        .then((resp) => {
          console.log(resp)
          this.alertMsg = "Permissions and Department Saved Successfully."
          this.alertType = "teal"
        })
        .catch((e) => (this.alertMsg = e.response.data))
      // this.showAccessDialog = false;
    },
    async loadUser(id) {
      secureGet(`${USERS_URL}/${id}`).then((resp) => {
        this.user = resp.data
        if (this.user.is_active == 1) this.user.status = "active"
        else this.user.status = "inactive"
      })
      secureGet(`${USERS_URL}/${id}/permissions`).then((resp) => {
        this.pendingDepartments = resp.data.departments
        this.pendingRoles = resp.data.roles
      })
    },
    async loadDepartments() {
      return secureGet(`${LOOKUP_URL}/department-branch`).then((resp) => {
        for (const key of Object.keys(resp.data))
          this.departments.push({
            name: key,
          })
      })
    },
    async loadRoles() {
      return secureGet(`${LOOKUP_URL}/roles`).then((resp) => {
        console.log(resp.data)
        this.roles = resp.data
      })
    },
  },
}
</script>
