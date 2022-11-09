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
        v-model="time"
        label="Departure Time"
        prepend-icon="mdi-clock"
        readonly
        v-bind="attrs"
        v-on="on"
        :disabled="review"
        :rules="requiredRules"
      >
      </v-text-field>
    </template>
    <v-time-picker
      format="24hr"
      scrollable
      v-model="time"
      @input="menu = false"
      :rules="requiredRules"
    >
    </v-time-picker>
  </v-menu>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      menu: false,
      time: "",
      requiredRules: [(v) => !!v || "This field is required"],
    };
  },
  methods: {
    returnDate() {
      this.$emit("returnTime", this.time);
    },
  },
};
</script>
