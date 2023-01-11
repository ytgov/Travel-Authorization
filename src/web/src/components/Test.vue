<template>
  <v-app> {{ userData }}</v-app>
</template>
<script>
import { PERM_URL } from "../urls";
import { secureGet } from "@/store/jwt";

export default {
  data: () => ({
    userData: {}
  }),
  created() {
    this.getAccess();
  },
  methods: {
    getAccess() {
      secureGet(`${PERM_URL}/`, { email: "Max.parker@yukon.ca" }).then(resp => {
        this.userData = resp.data;
      });
    }
  }
};
</script>
