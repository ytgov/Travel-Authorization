<template>
  <v-data-table
    :headers="headers"
    :items="items"
  >
    <template #item.outsideCanadaAndUsa>
      Refer to
      <a
        href="https://www.njc-cnm.gc.ca/directive/d10/v238/s659/en"
        target="_blank"
        >Canada's National Joint Council travel directive, Appendix C</a
      >.
    </template>
  </v-data-table>
</template>

<script setup>
const headers = [
  {
    text: "Within Canada",
    value: "withinCanada",
  },
  {
    text: "Within USA",
    value: "withinUsa",
  },
  {
    text: "Outside Canada and USA",
    value: "outsideCanadaAndUsa",
  },
]

const items = [
  {
    withinCanada: "$17.30 CAD",
    withinUsa: "$17.30 USD",
  },
]
</script>
