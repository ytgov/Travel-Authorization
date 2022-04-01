<template>
  <v-app>
    <v-container fluid>
      <H1>Yukon Government Expense Rates</H1>
      <Breadcrumbs />
    </v-container>
  </v-app>
</template>
<script>
import Breadcrumbs from "../../Breadcrumbs.vue";
export default {
  name: "flightEstimates",
  components: {
    Breadcrumbs,
  },
};
</script>