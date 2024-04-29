<template>
  <v-card
    outlined
    :style="{ border: border }"
  >
    <div
      :class="largeTitle ? 'custom-large-title-card' : 'custom-title-card'"
      :style="{ width: titleWidth }"
    >
      <slot name="title"></slot>
    </div>

    <slot name="body"></slot>
  </v-card>
</template>

<script>
export default {
  name: "TitleCard",
  props: {
    titleWidth: {
      type: String,
      required: true,
    },
    largeTitle: {
      type: Boolean,
      default: false,
    },
    border: {
      type: String,
      required: false,
      default: "",
    },
  },
}
</script>
<style scoped>
.custom-title-card {
  margin: -0.75rem 0 0 1rem;
  font-size: 12pt;
  font-weight: 600;
  background: white;
  z-index: 99;
}

.custom-large-title-card {
  margin: -0.75rem 0 0 1rem;
  font-size: 15.5pt;
  color: #5e5e5e;
  background: white;
  z-index: 99;
}
</style>
