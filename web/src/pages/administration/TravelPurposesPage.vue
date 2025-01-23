<template>
  <div>
    <v-alert color="warning"> Page is not yet implemented </v-alert>

    <h1>Travel Purposes</h1>
    <v-card>
      <v-text> Admin table for travel purpose </v-text>
    </v-card>
  </div>
</template>

<script setup>
import breadcrumbs from "@/use/use-breadcrumbs"

breadcrumbs([
  {
    text: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
  {
    text: "Travel Purposes",
    to: {
      name: "administration/TravelPurposesPage",
    },
  },
])
</script>
