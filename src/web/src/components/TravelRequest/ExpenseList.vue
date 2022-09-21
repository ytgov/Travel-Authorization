<template>
  <div>
    <h2>Expense List</h2>
    <div v-for="(expense, index) in expenses" :key="index">
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="expense.description"
            label="Name"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="expense.cost"
            label="Cost"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="expense.type"
            label="Description"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-menu
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
            v-model="expenseDateMenu[index]"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                outlined
                dense
                v-model="expenses[index].date"
                label="Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="expenses[index].date"
              @input="expenseDateMenu[index] = false"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" md="2">
          <v-select
            :items="currency"
            v-model="expense.currency"
            label="Currency"
            outlined
            dense
          ></v-select>
        </v-col>
        <v-col>
          <v-btn
            class="ma-2"
            dense
            small
            color="red"
            @click="removeExpense(index)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-btn color="primary" class="mr-5" @click="addExpense">Add Expense</v-btn>
    <v-btn color="green" class="mr-5" @click="saveExpenses()"
      >Save Expenses</v-btn
    >
    <v-snackbar v-model="snackbar" right color="success">
      <v-icon class="mr-3">mdi-thumb-up-outline</v-icon>
      {{ apiSuccess }}
    </v-snackbar>
  </div>
</template>

<script>
import { FORM_URL } from "../../urls";
import axios from "axios";
export default {
  name: "ExpenseList",
  async mounted() {
    this.formId = this.$route.params.formId;
    await this.getExpenses();
    this.expenses.push({
      description: "",
      cost: "",
      type: "",
      date: "",
      currency: "",
    });
  },
  data: () => ({
    expenses: [],
    currency: ["CAD", "USD", "EUR"],
    expenseDate: [],
    expenseDateMenu: [],
    formId: "",
    apiSuccess: "",
    snackbar: null,
  }),
  computed: {},
  methods: {
    addExpense() {
      this.expenses.push({
        description: "",
        cost: "",
        type: "",
        date: "",
        currency: "",
      });
    },

    removeExpense(index) {
      this.expenses.splice(index, 1);
    },

    saveExpenses() {
      axios
        .post(`${FORM_URL}/${this.formId}/expenses`, this.expenses)
        .then((resp) => {
          console.log(resp);
          this.apiSuccess = "Expenses saved successfully";
          this.snackbar = true;
        });
    },

    async getExpenses() {
      await axios
        .get(`${FORM_URL}/${this.formId}/expenses`, this.expenses)
        .then((resp) => {
          this.expenses = resp.data;
        });
    },

    getToday() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);
    },
  },
};
</script>

