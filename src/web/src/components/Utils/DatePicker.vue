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
        :rules="rules"
      ></v-text-field>
    </template>
    <v-date-picker
      v-bind="$attrs"
      :value="value"
      :rules="rules"
      @input="input"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    text: String,
    value: String,
    review: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [this.required],
    },
  },
  data() {
    return {
      menu: false,
      required: (v) => !!v || "This field is required",
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
