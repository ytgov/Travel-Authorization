<template>
  <v-card>
    <v-card-title><h3>Partial days on travel status</h3></v-card-title>
    <v-card-text> The amount claimed up to a maximum of: </v-card-text>
    <PartialDaysPerDiemsDataTable />
    <v-card-text
      >For travel outside Canada and USA, refer to
      <a
        href="https://www.njc-cnm.gc.ca/directive/d10/v238/s659/en"
        target="_blank"
        >Canada's National Joint Council travel directive, Appendix C</a
      >.</v-card-text
    >
  </v-card>
</template>

<script setup>
import PartialDaysPerDiemsDataTable from "@/components/per-diems/PartialDaysPerDiemsDataTable.vue"
</script>
