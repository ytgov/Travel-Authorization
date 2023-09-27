<template>
  <v-card
    elevation="2"
    class="default"
  >
    <v-card-title> Approvals </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        lazy-validation
      >
        TODO
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ApprovalsFormCard",
  data: () => ({
    required: (v) => !!v || "This field is required",
  }),
  computed: {},
  async mounted() {},
  methods: {},
}
</script>
