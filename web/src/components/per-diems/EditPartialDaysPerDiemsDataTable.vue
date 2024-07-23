<template>
  <v-data-table
    :headers="headers"
    :items="items"
  ></v-data-table>
</template>

<script setup>
const headers = [
  {
    text: "",
    value: "claimType",
  },
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

const items = [
  {
    claimType: "Breakfast",
    "yukon/alaska": "$25.95 CAD",
    nwt: "$28.20 CAD",
    nunavut: "$30.10 CAD",
    restOfCanada: "$24.90 CAD",
    restOfUsa: "$24.90 USD",
  },
  {
    claimType: "Lunch",
    "yukon/alaska": "$23.80 CAD",
    nwt: "$34.25 CAD",
    nunavut: "$36.55 CAD",
    restOfCanada: "$25.20 CAD",
    restOfUsa: "$25.20 USD",
  },
  {
    claimType: "Dinner",
    "yukon/alaska": "$68.65 CAD",
    nwt: "$73.25 CAD",
    nunavut: "$97.35 CAD",
    restOfCanada: "$61.85 CAD",
    restOfUsa: "$61.85 USD",
  },
]
</script>
