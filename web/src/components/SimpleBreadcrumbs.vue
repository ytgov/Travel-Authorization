<template>
  <v-breadcrumbs
    :items="items"
    large
  >
    <template #divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>
