<template>
  <div>
    <!-- <v-btn color="secondary" class="float-right mb-0 mt-2 pl-2" to="/admin/users" exact style="height: auto; font-size: .8rem; padding: 6px 10px;"
      ><v-icon class="mr-2" small>mdi-arrow-left</v-icon> Back to User Management</v-btn
    > -->
    <h1>
      User Editor:
      <small
        >{{ user.firstName }}
        {{ user.lastName }}

        <small>({{ user.status }})</small>
      </small>
    </h1>
    <Breadcrumbs />

    <v-row>
      <v-col
        cols="12"
        md="12"
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
                <!-- <v-col cols="12" sm="6">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="user.ExpirationDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="user.ExpirationDate"
                        label="Expiration date"
                        append-icon="mdi-calendar"
                        dense
                        outlined
                        background-color="white"
                        readonly
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                        clearable
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="user.ExpirationDate"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(user.ExpirationDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col> -->
                <v-col cols="12">
                  <v-select
                    :items="departments"
                    item-text="name"
                    item-value="id"
                    v-model="pendingDepartments"
                    label="Departments"
                    outlined
                    dense
                    multiple
                    small-chips
                    clearable
                    background-color="white"
                    hide-details
                    @input="getBranches"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-select
                    :items="myBranches"
                    item-text="fullName"
                    item-value="id"
                    v-model="pendingBranches"
                    label="Branches"
                    outlined
                    dense
                    multiple
                    small-chips
                    clearable
                    background-color="white"
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-select
                    label="Roles"
                    :items="roles"
                    v-model="pendingRoles"
                    outlined
                    dense
                    multiple
                    small-chips
                    clearable
                    item-value="id"
                    item-text="rolename"
                    background-color="white"
                    hide-details
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
            <v-row>
              <v-col>
                <!--
                    <v-btn class="black--text" depressed
                      v-if="isEditable">
                        Reset Password
                    </v-btn>
                    -->
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                class="d-flex py-0"
              >
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  class="mr-5 mt-0"
                  @click="doSave"
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
import { USERS_URL, LOOKUP_URL } from "../../../../urls"
import Breadcrumbs from "../../../Breadcrumbs.vue"
import { secureGet, securePut } from "@/store/jwt"
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
    pendingDepartments: [],
    pendingBranches: [],

    departments: [],
    branches: [],
    roles: [],
    showAccessDialog: false,
  }),
  async mounted() {
    await this.loadDepartments()
    await this.loadRoles()
    await this.loadUser(this.$route.params.id)
    this.getBranches()
  },
  computed: {
    myBranches: function () {
      return this.branches.filter((b) => {
        return this.pendingDepartments.indexOf(b.ownedby) >= 0
      })
    },
  },
  watch: {},
  methods: {
    async doSave() {
      this.saveAccess()
    },
    async saveAccess() {
      // await this.saveUserAccess(this.accessItem);
      this.pendingBranches = this.pendingBranches.filter((b) => {
        let found = this.branches.find((x) => x.id === b)
        return this.pendingDepartments.indexOf(found.ownedby) >= 0
      })
      let permsObject = {
        departments: [...this.pendingDepartments, ...this.pendingBranches],
        roles: this.pendingRoles,
      }
      securePut(`${USERS_URL}/${this.$route.params.id}/permissions`, permsObject).then((resp) => {
        console.log(resp)
      })
      // this.showAccessDialog = false;
    },
    async loadUser(id) {
      secureGet(`${USERS_URL}/${id}`).then((resp) => {
        this.user = resp.data
        if (this.user.is_active == 1) this.user.status = "active"
        else this.user.status = "inactive"
      })
      secureGet(`${USERS_URL}/${id}/permissions`).then((resp) => {
        for (let i = 0; i < resp.data.departments.length; i++) {
          if (this.departments[resp.data.departments[i].objectid])
            this.pendingDepartments.push(resp.data.departments[i].objectid)
          else this.pendingBranches.push(resp.data.departments[i].objectid)
        }

        this.pendingRoles = resp.data.roles.map((entry) => {
          return entry.roleid
        })
      })
    },
    async loadDepartments() {
      return secureGet(`${LOOKUP_URL}/departments`).then((resp) => {
        this.departments = resp.data
      })
    },
    async getBranches() {
      await secureGet(`${LOOKUP_URL}/branches`).then((resp) => {
        this.branches = resp.data
      })
    },
    loadUnits() {
      secureGet(`${LOOKUP_URL}/departments`).then((resp) => {
        this.departments = resp.data
      })
    },
    loadRoles() {
      secureGet(`${LOOKUP_URL}/roles`).then((resp) => {
        this.roles = resp.data
      })
    },
  },
}
</script>
