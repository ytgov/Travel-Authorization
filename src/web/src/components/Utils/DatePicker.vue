<template>
  <v-menu
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
    v-model="menu"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        dense
        v-model="date"
        :label="value"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        :rules="requiredRules"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      @input="menu = false"
      :rules="requiredRules"
    ></v-date-picker>
  </v-menu>
</template>
<script>
export default {
  props: {
    text: String,
    value: String,
    review: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menu: false,
      date: "",
      requiredRules: [(v) => !!v || "This field is required"],
    };
  },
  methods: {
    returnDate() {
      this.$emit("date", this.date);
    },
  },
};
</script>

