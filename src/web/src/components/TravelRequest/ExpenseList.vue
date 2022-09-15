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
    <v-btn color="green" class="mr-5" @click="saveExpenses"
      >Save Expenses</v-btn
    >
  </div>
</template>

<script>
export default {
  name: "ExpenseList",
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
    currency: ["CAD", "USD", "EUR"],
    expenseDate: [],
    expenseDateMenu: [],
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

    getToday() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);
    },
  },
};
</script>

