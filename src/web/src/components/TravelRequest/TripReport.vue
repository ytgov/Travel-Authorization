<template>
  <v-form ref="report" lazy-validation>
    <h2>Post Trip Report</h2>
    <v-row>
      <v-card elevation="2" style="margin: 20px">
        <v-card-title>
          Expense Total: ${{ expensesTotal }} <br />
          Estimates Total: ${{ estimatesTotal }} <br />
          Cost Difference: ${{ costDifference }}
        </v-card-title>
      </v-card>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="report.costDifferenceExplanation"
          label="Cost differences"
          hint="Provide a brief rationale if there is significant difference from the estimated cost."
          :disabled="review"
          :rules="requiredRules"
          rows="1"
          auto-grow
        >
        </v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="report.skillsGained"
          label="Skills gained"
          hint="Specific knowledge gained which will benefit the Government of Yukon."
          :disabled="review"
          :rules="requiredRules"
          rows="1"
          auto-grow
        >
        </v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="report.applicationTimeframe"
          label="Skill application timeframe"
          hint="Estimated timeframe in whichthese benefits will become evident"
          :disabled="review"
          :rules="requiredRules"
          rows="1"
          auto-grow
        >
        </v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="report.benefitsToUnit"
          label="Benefits to your area (department/unit)"
          hint="What are the expected benefits to your program?"
          :disabled="review"
          :rules="requiredRules"
          rows="1"
          auto-grow
        >
        </v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="report.benefitsToYG"
          label="Benefits to YG"
          hint="What are the expected benefits to the Government of Yukon?"
          :disabled="review"
          :rules="requiredRules"
          rows="1"
          auto-grow
        >
        </v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="report.futureRecommendations"
          label="Future recommendations"
          hint="What recommendations would you make for similar trips in the future?"
          :disabled="review"
          :rules="requiredRules"
          rows="1"
          auto-grow
        >
        </v-textarea>
      </v-col>
    </v-row>
    <v-btn color="blue" class="mr-5" @click="submitReport()">
      Submit Expenses and Report
    </v-btn>
    <v-btn color="green" class="mr-5" @click="saveReport()">Save Report</v-btn>
  </v-form>
</template>
<script>
import { FORM_URL } from "../../urls";
import { secureGet, securePost } from "@/store/jwt";

export default {
  data: () => ({
    report: {
      costDifferenceExplanation: "",
      skillsGained: "",
      applicationTimeframe: "",
      benefitsToUnit: "",
      benefitsToYG: "",
      futureRecommendations: ""
    },
    requiredRules: [v => !!v || "This field is required"],
    expensesTotal: 0,
    estimatesTotal: 0,
    costDifference: 0,
    review: false
  }),

  methods: {
    async getReport() {
      let formId = this.form.formId || this.$route.params.formId;
      return secureGet(`${FORM_URL}/${formId}/report`).then(resp => {
        return resp.data;
      });
    },

    submitReport() {
      if (this.$refs.report.validate()) {
        let formId = this.form.formId ? this.form.formId : this.$route.params.formId;
        securePost(`${FORM_URL}/${formId}/report/submit`, this.report).then(resp => {
          console.log(resp);
          this.apiSuccess = "Report Submitted";
          this.snackbar = true;
          this.requestPage();
        });
      }
    },

    saveReport() {
      let formId = this.form.formId ? this.form.formId : this.$route.params.formId;
      securePost(`${FORM_URL}/${formId}/report/save`, this.report).then(resp => {
        console.log(resp);
        this.apiSuccess = "Report Saved";
        this.snackbar = true;
      });
    }
  }
};
</script>
