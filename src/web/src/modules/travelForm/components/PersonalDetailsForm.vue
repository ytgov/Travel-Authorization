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

      <!-- <v-row>
        <v-col class="col-auto pb-0">
          <v-btn
            color="primary"
            @click="continueClick"
          >
            Continue
          </v-btn>
        </v-col>
      </v-row> -->
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
  name: "PersonalDetailsForm",
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
    ...mapState("travelForm", ["departments", "request", "emails"]),
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
    await this.loadDepartments().finally(() => {
      this.loadingDepartments = false
    })

    await this.loadUser()
  },
  methods: {
    ...mapActions("travelForm", ["loadDepartments", "loadUser", "emailSearch"]),
    searchEmail(token) {
      return this.emailSearch(token)
    },
    // continueClick() {
    //   let formValid = this.$refs.form.validate()
    //   if (formValid) this.continue()
    // },
    // loadUserWrapper() {
    //   return this.loadUser().catch((error) => {
    //     this.snackbarStatus = "error"
    //     this.snackbarMessage = error.response.message
    //     this.showSnackbar = true
    //   })
    // },
  },
}
</script>
