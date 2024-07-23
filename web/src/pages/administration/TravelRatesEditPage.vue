<template>
  <v-container>
    <h2>Meals and Incidental Expenses for Employees on Travel Status</h2>

    TODO: add edit table for per-diems
    <br />
    TODO: add edit table for travel allowances
  </v-container>
</template>

<script setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

useBreadcrumbs([
  {
    text: "Administration",
    to: { name: "AdministrationPage" },
  },
  {
    text: "Travel Rates",
    to: { name: "administration/TravelRatesPage" },
  },
  {
    text: "Edit",
    to: { name: "administration/TravelRatesEditPage" },
  },
])
</script>
