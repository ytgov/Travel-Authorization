<template>
  <v-app> {{ userData }}</v-app>
</template>
<script>
import { PERM_URL } from "../urls";
import axios from "axios";

export default {
  data: () => ({
    userData: {},
  }),
  created() {
    this.getAccess();
  },
  methods: {
    getAccess() {
      axios
        .get(`${PERM_URL}/`, { email: "Max.parker@yukon.ca" })
        .then((resp) => {
          this.userData = resp.data;
        });
    },
  },
};
</script>