<template>
  <v-container>
    <!-- <v-btn color="secondary" class="float-right mb-0 mt-2 pl-2" to="/admin/users" exact style="height: auto; font-size: .8rem; padding: 6px 10px;"
      ><v-icon class="mr-2" small>mdi-arrow-left</v-icon> Back to User Management</v-btn
    > -->
    <h1>
      User Editor:
      <small
        >{{ user.first_name }} {{ user.last_name }}

        <small>({{ user.status }})</small>
      </small>
    </h1>
    <Breadcrumbs />

    <v-row>
      <v-col cols="12" md="12">
        <v-card class="default">
          <v-card-title>User Details</v-card-title>
          <v-card-text>
            <v-form>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.first_name"
                    label="First name"
                    dense
                    outlined
                    background-color="white"
                    required
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.last_name"
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
                <v-col cols="6">
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
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    label="Units"
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
                    <v-btn class="black--text" depressed elevation="0"
                      v-if="isEditable">
                        Reset Password
                    </v-btn>
                    -->
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex py-0">
                <v-spacer></v-spacer>
                <v-btn color="primary" class="mr-5 mt-0" @click="doSave">
                  Save user
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { USERS_URL, LOOKUP_URL } from "../../../../urls";
import Breadcrumbs from "../../../Breadcrumbs.vue";
export default {
  components: {
    Breadcrumbs,
  },
  data: () => ({
    overlay: false,
    accessItem: { AccessType: 1, AccessText: 1 },
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

    departments: [],
    roles: [],
    showAccessDialog: false,
  }),
  async mounted() {
    // this.loadRoles();
    this.loadUser(this.$route.params.id);
    this.loadDepartments();
    this.loadRoles();
  },
  computed: {},
  watch: {},
  methods: {
    async doSave() {
      this.saveAccess();
      this.loadUser(this.$route.params.id);
    },
    async saveAccess() {
      // await this.saveUserAccess(this.accessItem);
      let permsObject = {
        departments: this.pendingDepartments,
        roles: this.pendingRoles,
      };
      axios
        .put(`${USERS_URL}/${this.$route.params.id}/permissions`, permsObject)
        .then((resp) => {
          console.log(resp);
        });
      // this.showAccessDialog = false;
    },
    loadUser(id) {
      axios.get(`${USERS_URL}/${id}`).then((resp) => {
        this.user = resp.data;
        if (this.user.is_active == 1) this.user.status = "Active";
        else this.user.status = "Inactive";
      });
      axios.get(`${USERS_URL}/${id}/permissions`).then((resp) => {
        this.pendingDepartments = resp.data.departments.map((entry) => {
          return entry.objectid;
        });
        this.pendingRoles = resp.data.roles.map((entry) => {
          return entry.roleid;
        });
      });
    },
    loadDepartments() {
      axios.get(`${LOOKUP_URL}/departments`).then((resp) => {
        this.departments = resp.data;
      });
    },
    loadUnits() {
      axios.get(`${LOOKUP_URL}/departments`).then((resp) => {
        this.departments = resp.data;
      });
    },
    loadRoles() {
      axios.get(`${LOOKUP_URL}/roles`).then((resp) => {
        this.roles = resp.data;
      });
    },
  },
};
</script>