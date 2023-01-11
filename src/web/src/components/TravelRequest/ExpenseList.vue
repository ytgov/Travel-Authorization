<template>
  <div>
    <v-card elevation="2" style="margin: 5px">
      <v-card-title>Per Diems Calculator</v-card-title>

      <v-card-text>
        Per Diem Total for food
        <v-row>
          <v-col>
            <DatePicker></DatePicker>
          </v-col>
          <v-col>
            <TimePicker></TimePicker>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-checkbox dense label="Did you use a personal vehicle during this trip?"> </v-checkbox>
      </v-card-text>
      <v-card-text>How many nights did you arrange for personal accomadation?</v-card-text>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="expenses"
      sort-by="date"
      class="elevation-2"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:top>
        <v-toolbar flat>
          <h2>{{ title }}</h2>
          <!-- <v-toolbar-title>Expenses</v-toolbar-title> -->
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="blue" dark class="mb-2" v-bind="attrs" v-on="on">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.description" label="Description" outlined dense></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.cost" label="Cost" outlined dense></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        :items="currency"
                        v-model="editedItem.currency"
                        label="Currency"
                        outlined
                        dense
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-menu
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                        v-model="dateMenu"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            outlined
                            dense
                            v-model="editedItem.date"
                            label="Date"
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="editedItem.date" @input="dateMenu = false"></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Ok </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="240px">
            <v-card>
              <v-card-title class="text-h5 text-center">Delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <v-btn color="green" class="mr-5" @click="saveExpenses()">Save {{ title }} </v-btn>
    <v-snackbar v-model="snackbar" right color="success">
      <v-icon class="mr-3">mdi-thumb-up-outline</v-icon>
      {{ apiSuccess }}
    </v-snackbar>
  </div>
</template>

<script>
import { FORM_URL } from "../../urls";
import { secureGet, securePost } from "@/store/jwt";
import DatePicker from "../Utils/DatePicker";
import TimePicker from "../Utils/TimePicker";
export default {
  name: "ExpenseList",
  components: {
    DatePicker,
    TimePicker
  },
  async mounted() {
    this.formId = this.$route.params.formId;
    this.expenses = await this.getExpenses();
  },
  props: ["title"],
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },
  data: () => ({
    headers: [
      {
        text: "Description",
        align: "start",
        value: "description"
      },
      { text: "Cost", value: "cost" },
      { text: "Date", value: "date" },
      { text: "Currency", value: "currency" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    dialog: false,
    dialogDelete: false,
    expenses: [],
    editedIndex: -1,
    editedItem: {
      description: "",
      cost: "",
      date: "",
      currency: ""
    },
    defaultItem: {
      description: "",
      cost: "",
      date: "",
      currency: ""
    },

    currency: ["CAD", "USD", "EUR"],
    expenseDate: [],
    dateMenu: false,
    formId: "",
    apiSuccess: "",
    snackbar: null
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.expenses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.expenses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.expenses.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      console.log(this.editedItem);
      if (this.editedIndex > -1) {
        Object.assign(this.expenses[this.editedIndex], this.editedItem);
      } else {
        this.expenses.push(this.editedItem);
      }
      this.close();
    },

    async getExpenses() {
      return await secureGet(`${FORM_URL}/${this.formId}/expenses/${this.title}`).then(resp => {
        return resp.data;
      });
    },

    saveExpenses() {
      securePost(`${FORM_URL}/${this.formId}/expenses/${this.title}`, this.expenses).then(resp => {
        this.$emit("reloadCost");
        this.apiSuccess = resp.data;
        this.snackbar = true;
      });
    },

    getToday() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10);
    }
  }
};
</script>
