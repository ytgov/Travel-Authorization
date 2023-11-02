<template>
  <v-card
    elevation="2"
    class="default"
  >
    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-text-field
              dense
              v-model="request.firstName"
              label="First name"
              required
              outlined
              background-color="white"
              :loading="loadingUser"
              :rules="firstNameRules"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-text-field
              dense
              v-model="request.lastName"
              label="Last name"
              required
              outlined
              background-color="white"
              :loading="loadingUser"
              :rules="lastNameRules"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-text-field
              v-model="request.email"
              dense
              outlined
              background-color="white"
              label="Email"
              required
              :loading="loadingUser"
              :rules="emailRules"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-text-field
              v-model="request.mailcode"
              dense
              outlined
              background-color="white"
              label="Mailcode"
              required
              :loading="loadingUser"
              :rules="requiredRules"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="12"
            class="pb-0 mb-0"
          >
            <v-combobox
              v-model="request.supervisorEmail"
              dense
              outlined
              background-color="white"
              label="Supervisor Email"
              persistent-hint
              :items="emails"
              required
              clearable
              :loading="loadingUser"
              :rules="emailRules"
              @update:search-input="searchEmail"
              :return-object="false"
            ></v-combobox>
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-select
              :items="departments"
              v-model="request.department"
              label="Department"
              dense
              outlined
              background-color="white"
              item-text="name"
              item-value="name"
              clearable
              :rules="requiredRules"
              :loading="loadingDepartments"
            ></v-select>
          </v-col>

          <v-col
            v-if="request.department && divisions && divisions.length > 0"
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-select
              :items="divisions"
              v-model="request.division"
              item-text="name"
              item-value="name"
              label="Division"
              dense
              outlined
              background-color="white"
              clearable
            ></v-select>
          </v-col>
          <v-col
            v-if="request.division && branches.length > 0"
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-select
              :items="branches"
              item-text="name"
              v-model="request.branch"
              label="Branch"
              dense
              clearable
              outlined
              background-color="white"
            ></v-select>
          </v-col>
          <v-col
            v-if="request.branch && units.length > 0"
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-select
              :items="units"
              v-model="request.unit"
              item-value="name"
              item-text="name"
              label="Unit"
              dense
              clearable
              outlined
              background-color="white"
            ></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
  name: "PersonalDetailsFormEdit",
  data: () => ({
    loadingDepartments: false,
    loadingUser: false,

    //Rules
    firstNameRules: [(v) => !!v || "First name is required"],
    lastNameRules: [(v) => !!v || "Last name is required"],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) =>
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "E-mail must be valid",
    ],
    requiredRules: [(v) => !!v || "This field is required"],
  }),
  computed: {
    ...mapState("travelAuthorizations", ["departments", "request", "emails"]),
    divisions() {
      const department = this.departments.find((d) => d.name == this.request.department)
      return department?.divisions || []
    },
    branches() {
      const division = this.divisions.find((d) => d.name == this.request.division)
      return division?.branches || []
    },
    units() {
      const branch = this.branches.find((b) => b.name == this.request.branch)
      return branch?.units || []
    },
  },
  async mounted() {
    this.loadingDepartments = true
    this.loadingUser = true
    await Promise.all([
      this.loadDepartments().finally(() => {
        this.loadingDepartments = false
      }),
      this.loadUserWrapper().finally(() => {
        this.loadingUser = false
      }),
    ])
  },
  methods: {
    ...mapActions("travelAuthorizations", ["loadDepartments", "loadUser", "emailSearch"]),
    searchEmail(token) {
      return this.emailSearch(token)
    },
    loadUserWrapper() {
      return this.loadUser().catch((error) => {
        this.$snack(error.message, { color: "error" })
      })
    },
  },
}
</script>
