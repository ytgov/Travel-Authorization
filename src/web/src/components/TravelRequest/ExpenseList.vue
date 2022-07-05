<template>
  <div>
    <h2>Expense List</h2>
    <div v-for="(expense, index) in expenses" :key="index">
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="expense.name"
            label="Name"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="expense.amount"
            label="Amount"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="expense.description"
            label="Description"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="expense.date"
            label="Date"
            outlined
            dense
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field
            v-model="expense.currency"
            label="Currency"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn
            class="ma-2"
            dense
            small
            color="red"
            @click="removeExpense(index)"
            :disabled="review"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-btn color="primary" class="mr-5" @click="addExpense">Add Expense</v-btn>
    <v-btn color="green" class="mr-5" @click="saveExpenses"
      >Save Expenses</v-btn
    >
  </div>
</template>

<script>
import { FORM_URL } from "../../urls";
import axios from "axios";
export default {
  name: "Form",
  created() {
    this.expenses.push({
      description: "",
      amount: "",
      currency: "",
      date: "",
      time: "",
    });
  },
  data: () => ({
    expenses: [],
  }),
  computed: {},
  methods: {
    addExpense() {
      this.expenses.push({
        description: "",
        amount: "",
        currency: "",
        date: "",
        time: "",
      });
    },

    removeExpense(index) {
      this.expenses.splice(index, 1);
    },
    saveExpenses() {},
    submitForm() {},
    saveForm() {},
    report() {},

    getToday() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);
    },
    getForm(formId) {
      axios.get(`${FORM_URL}/${formId}`).then((resp) => {
        this.form = resp.data;
      });
    },
  },
};
</script>

