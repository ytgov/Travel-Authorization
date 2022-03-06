<template>
  <div class="books">
    <h1>Travel Request</h1>

    <v-banner icon="mdi-cash-register">
      <h2>Form help</h2>
      Help text can go in here to make the form more</v-banner
    >

    <p></p>
    <v-form v-model="form1Valid">
      <div class="row">
        <div class="col-2">
          <v-text-field
            dense
            v-model="tanumber"
            outlined
            label="TA No"
            required
            disabled
            filled
          ></v-text-field>
        </div>
        <div class="col-5">
          <v-text-field
            dense
            v-model="firstName"
            outlined
            label="First name"
            required
            :rules="firstNameRules"
          ></v-text-field>
        </div>
        <div class="col-5">
          <v-text-field
            dense
            v-model="lastName"
            outlined
            label="Last name"
            required
            :rules="lastNameRules"
          ></v-text-field>
        </div>
      </div>
      <v-row>
        <v-col cols="4">
          <v-autocomplete
          label="Department"
          v-model="department"
          outlined
          dense
          required
          :items="depts"></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-autocomplete
          label="Branch"
          v-model="branch"
          outlined
          dense
          required
          :items="branches"></v-autocomplete>
        </v-col>
        <v-col cols="4">
        <v-text-field
        v-model="email"
        dense
        outlined
        label="Email"
        required
        :rules="emailRules"
      ></v-text-field>
        </v-col>

      </v-row>
<v-row>
  <v-col cols="4">
    <v-autocomplete        
     v-model="from"
        outlined
        dense
        label="Where you are travelling from?"
        persistent-hint
        :items="froms"
        required
        clearable
        :rules="fromRules">
    </v-autocomplete>
    </v-col>
<v-col cols="4">
    <v-autocomplete        
     v-model="destination"
        outlined
        dense
        label="Where you are travelling from?"
        persistent-hint
        :items="destinations"
        required
        clearable
        :rules="destinationRules">
    </v-autocomplete>
</v-col>
<v-col cols="2">
<v-date-picker
        v-model="dates"
        range
        label="Travel Dates"
      ></v-date-picker>
</v-col>
<v-col cols="2">
  
</v-col>
</v-row>

</v-form>

    <v-btn
      color="primary"
      class="mr-5"
      @click="saveForm"
      >Save</v-btn
    >
    <v-btn color="secondary">Cancel</v-btn>

    <v-snackbar v-model="snackbar" right color="success">
      <v-icon class="mr-3">mdi-thumb-up-outline</v-icon>
      {{ apiSuccess }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "Form",
  data: () => ({
   tanumber: "T12343",
   firstName: "",
    firstNameRules: [
      v => !!v || "First name is required",
      v => (v && v.length <= 10) || "First name must be less than 10 characters"
    ],
    lastName: "",
    lastNameRules: [
      v => !!v || "Last name is required",
      v => (v && v.length <= 10) || "Last name must be less than 10 characters"
    ],
    department:"",
    depts:["Community Services","Energy, Mines and Resources","Environment", "Executive Council Office","Health and Social Services","Highways & Public Works, "],
    branch:"",
    branches: ["ICT","TAD","TEB", "TMB"],
    email: "",
    emailRules: [
      v => !!v || "Email is required",
      v => {
        if (v) return true;

        return "";
      }
    ],
    from: "Whitehorse",
    fromRules: [v => !!v || "Travelling from is required"],
    froms: ["Whitehorse", "Dawson", "Watson Lake"],
    destination: "",
    destinationRules: [v => !!v || "Travelling to is required"],
    destinations: ["Vancouver", "Calgary", "Edmonton", "Toronto", "Ottawa"],
    dates:[],
    showError: null,
    snackbar: null,
    apiSuccess: ""
  }),
  methods: {
    saveForm() {
      this.showError = false;

      console.log("SAVING " + this.team);

      if (this.from == "Whitehorse") {
        this.snackbar = true;
        this.apiSuccess = "This message came from the API";
        console.log("CORRECT!@");
      } else {
        this.showError = true;
      }
    }
  }
};
</script>
