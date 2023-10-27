<template>
  <v-card :loading="loadingData" :disabled="loadingData" en class="px-5 pb-15">
    <div v-if="loadingData" class="mt-10" style="text-align: center">loading ...</div>
    <v-alert v-if="alertMsg" class="mt-5" type="warning">{{ alertMsg }}</v-alert>
    <v-toolbar v-if="!loadingData" class="" height="100px" flat>
      <v-toolbar-title>Pre-Approved Travel</v-toolbar-title>

      <template v-slot:extension>
        <v-tabs v-model="tabs" active-class="primary--text teal lighten-5">
          <v-tab>Requests</v-tab>
          <v-tab>Submissions</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-if="!loadingData" v-model="tabs">
      <v-tab-item>
        <v-card flat>
          <preapproved-requests :travelRequests="travelRequests" @updateTable="updatePreapprovedTravel()" />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <submissions
            :travelSubmissions="travelSubmissions"
            :travelRequests="travelRequests"
            @updateTable="updatePreapprovedTravel()"
          />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import PreapprovedRequests from "./Requests/PreapprovedRequests.vue";
import Submissions from "./Submissions/Submissions.vue";
import { PREAPPROVED_URL, LOOKUP_URL, PROFILE_URL } from "../../../urls";
import { secureGet } from "../../../store/jwt";

export default {
  name: "Preapproved",
  components: {
    PreapprovedRequests,
    Submissions
  },
  data() {
    return {
      tabs: null,
      travelRequests: [],
      loadingData: false,
      travelSubmissions: [],
      alertMsg: ""
    };
  },
  async mounted() {
    this.loadingData = true;
    // await this.getUserAuth()
    await this.getEmployees();
    await this.getDepartmentBranch();
    await this.getTravelPurposes();
    await this.getPreapprovedTravel();
    await this.getPreapprovedTravelSubmissions();
    this.determineDepartment();
    this.loadingData = false;
  },
  methods: {

    async updatePreapprovedTravel(){
      this.loadingData = true;
      await this.getPreapprovedTravel();
      await this.getPreapprovedTravelSubmissions();
      this.determineDepartment();
      this.loadingData = false;
    },

    async getUserAuth() {
      return secureGet(`${PROFILE_URL}`)
        .then(resp => {
          this.$store.commit("auth/setUser", resp.data.user);
        })
        .catch(e => {
          console.log(e);
        });
    },

    async getEmployees() {
      return secureGet(`${LOOKUP_URL}/employees`)
        .then(resp => {
          this.$store.commit("preapproved/SET_EMPLOYEES", resp.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    async getDepartmentBranch() {
      return secureGet(`${LOOKUP_URL}/department-branch`)
        .then(resp => {
          this.$store.commit("preapproved/SET_DEPARTMENT_BRANCH", resp.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    async getTravelPurposes(){
      return secureGet(`${LOOKUP_URL}/travelPurpose`)
        .then(resp => {
          this.$store.commit("preapproved/SET_TRAVEL_PURPOSES", resp.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    async getPreapprovedTravel() {
      return secureGet(`${PREAPPROVED_URL}/`)
        .then(resp => {
          this.travelRequests = resp.data.map(x => ({
            ...x,
            isSelectable: x.status != "Approved" && x.status != "Declined"
          }));
        })
        .catch(e => {
          console.log(e);
        });
    },

    async getPreapprovedTravelSubmissions() {
      return secureGet(`${PREAPPROVED_URL}/submissions`)
        .then(resp => {
          this.travelSubmissions = resp.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    determineDepartment() {
      this.alertMsg = "";
      if (!this.$store.state.auth.department) {
        const email = this.$store.state.auth.user.email;
        const employee = this.$store.state.preapproved.employees.filter(emp => emp.email == email);
        if (employee.length > 0) {
          this.$store.dispatch("UpdateUserDepartment", employee[0].department);
        } else {
          this.alertMsg = "Your department is undefined. Please contact system administrator.";
        }
      }
      this.loadingData = false;
    }
  }
};
</script>
