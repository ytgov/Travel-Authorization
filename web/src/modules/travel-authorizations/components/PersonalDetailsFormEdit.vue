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
              v-model="request.firstName"
              dense
              label="First name"
              required
              outlined
              background-color="white"
              :loading="isLoadingCurrentUser"
              :rules="firstNameRules"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-text-field
              v-model="request.lastName"
              dense
              label="Last name"
              required
              outlined
              background-color="white"
              :loading="isLoadingCurrentUser"
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
              :loading="isLoadingCurrentUser"
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
              :loading="isLoadingCurrentUser"
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
              :loading="isLoadingCurrentUser"
              :rules="emailRules"
              :return-object="false"
              @update:search-input="searchEmail"
            ></v-combobox>
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="pb-0 mb-0"
          >
            <v-select
              v-model="request.department"
              :items="departments"
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
              v-model="request.division"
              :items="divisions"
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
              v-model="request.branch"
              :items="branches"
              item-text="name"
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
              v-model="request.unit"
              :items="units"
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
import { mapState, mapActions, mapGetters } from "vuex"

export default {
  name: "PersonalDetailsFormEdit",
  data: () => ({
    loadingDepartments: false,

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
    ...mapGetters("current/travelAuthorization", {
      request: "attributes",
    }),
    ...mapGetters("current/user", {
      isLoadingCurrentUser: "isLoading",
    }),
    ...mapState("travelAuthorizations", ["departments", "emails"]),
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
    await Promise.all([
      this.loadDepartments().finally(() => {
        this.loadingDepartments = false
      }),
      this.ensureCurrentUserWrapper().catch((error) => {
        this.$snack(error.message, { color: "error" })
      }),
    ])
  },
  methods: {
    ...mapActions("current/user", { ensureCurrentUser: "ensure" }),
    ...mapActions("travelAuthorizations", ["loadDepartments", "emailSearch"]),
    searchEmail(token) {
      return this.emailSearch(token)
    },
  },
}
</script>
