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
        :value="value"
        :label="text"
        prepend-icon="mdi-calendar"
        readonly
        background-color="white"
        outlined
        v-bind="attrs"
        v-on="on"
        :rules="requiredRules"
      ></v-text-field>
    </template>
    <v-date-picker
      :value="value"
      :rules="requiredRules"
      @input="input"
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
      requiredRules: [(v) => !!v || "This field is required"],
    }
  },
  methods: {
    input(value) {
      this.menu = false
      this.$emit("input", value)
    },
  },
}
</script>
