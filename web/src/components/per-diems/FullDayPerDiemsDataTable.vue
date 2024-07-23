<template>
  <v-data-table
    :headers="headers"
    :items="items"
  ></v-data-table>
</template>

<script setup>
const headers = [
  {
    text: "Yukon/Alaska",
    value: "yukon/alaska",
  },
  {
    text: "NWT",
    value: "nwt",
  },
  {
    text: "Nunavut",
    value: "nunavut",
  },
  {
    text: "Rest of Canada",
    value: "restOfCanada",
  },
  {
    text: "Rest of USA",
    value: "restOfUsa",
  },
]

// Values are to be a sum of breakfast, lunch, and dinner + incidentals.
const items = [
  {
    "yukon/alaska": "$135.70 CAD",
    nwt: "$153.00 CAD",
    nunavut: "$181.30 CAD",
    restOfCanada: "$129.25 CAD",
    restOfUsa: "$129.25 USD",
  },
]
</script>
