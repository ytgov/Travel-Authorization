<template>
  <v-card :loading="loadingData" :disabled="loadingData" en class="px-5 pb-15">
    
  </v-card>
</template>

<script>

// import { PREAPPROVED_URL, LOOKUP_URL } from "../../../urls";
// import { secureGet } from "../../../store/jwt";

export default {
  name: "TravelDesk",
  components: {
    // PreapprovedRequests,
    // Submissions
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
  mounted() {
    // this.getEmployees();
    //this.getPreapprovedTravel()
  },
  methods: {
    // getEmployees() {
    //   this.loadingData = true;
    //   secureGet(`${LOOKUP_URL}/employees`)
    //     .then(resp => {
    //       this.$store.commit("preapproved/SET_EMPLOYEES", resp.data);
    //       this.getDepartmentBranch();
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },

    // getDepartmentBranch() {
    //   secureGet(`${LOOKUP_URL}/department-branch`)
    //     .then(resp => {
    //       this.$store.commit("preapproved/SET_DEPARTMENT_BRANCH", resp.data);
    //       this.getTravelPurposes();
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },

    // getTravelPurposes(){
    //   secureGet(`${LOOKUP_URL}/travelPurpose`)
    //     .then(resp => {          
    //       this.$store.commit("preapproved/SET_TRAVEL_PURPOSES", resp.data);
    //       this.getPreapprovedTravel();
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },

    // getPreapprovedTravel() {
    //   this.loadingData = true;
    //   secureGet(`${PREAPPROVED_URL}/`)
    //     .then(resp => {
    //       this.travelRequests = resp.data.map(x => ({
    //         ...x,
    //         isSelectable: x.status != "Approved" && x.status != "Declined"
    //       }));
    //       this.getPreapprovedTravelSubmissions();
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },

    // getPreapprovedTravelSubmissions() {
    //   secureGet(`${PREAPPROVED_URL}/submissions`)
    //     .then(resp => {
    //       this.travelSubmissions = resp.data;
    //       this.determineDepartment();
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },

    // determineDepartment() {
    //   this.alertMsg = "";
    //   if (!this.$store.state.auth.department) {
    //     const email = this.$store.state.auth.user.email;
    //     const employee = this.$store.state.preapproved.employees.filter(emp => emp.email == email);
    //     if (employee.length > 0) {
    //       this.$store.dispatch("UpdateUserDepartment", employee[0].department);
    //     } else {
    //       this.alertMsg = "Your department is undefined. Please contact system administrator.";
    //     }
    //   }
    //   this.loadingData = false;
    // }
  }
};
</script>
