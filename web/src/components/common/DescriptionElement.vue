<template>
  <div class="body-1 text--primary">
    <dt class="d-flex align-center font-weight-bold">
      <v-icon
        v-if="icon"
        size="18"
        class="mr-2"
        aria-hidden="true"
        >{{ icon }}</v-icon
      >
      <span>{{ label }}</span>
    </dt>
    <dd class="mt-2 font-weight-medium">
      <slot>{{ value }}</slot>
    </dd>
  </div>
</template>

<script setup>
defineProps({
  /**
   * The label text to display
   */
  label: {
    type: String,
    required: true,
  },
  /**
   * Optional icon name from Material Design Icons (e.g., 'mdi-account')
   */
  icon: {
    type: String,
    default: "",
  },
  /**
   * The value to display. Not required if using slot content
   */
  value: {
    type: [String, Number, Boolean],
    default: "",
  },
})
</script>

<style scoped></style>
