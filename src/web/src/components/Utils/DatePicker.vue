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
        :value="value || ''"
        :label="text"
        :rules="rules"
        background-color="white"
        prepend-icon="mdi-calendar"
        dense
        outlined
        readonly
        v-bind="{ ...$attrs, ...attrs }"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-bind="$attrs"
      :value="value"
      @input="input"
    ></v-date-picker>
  </v-menu>
</template>

<script>
const required = (v) => !!v || "This field is required"

export default {
  inheritAttrs: false,
  props: {
    text: String, // DEPRECATED: prefer label
    value: String,
    rules: {
      type: Array,
      default: () => [required],
    },
  },
  data: () => ({
    menu: false,
  }),
  methods: {
    input(value) {
      this.menu = false
      this.$emit("input", value)
    },
  },
}
</script>
