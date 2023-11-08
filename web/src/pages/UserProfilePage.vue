<template>
  <div>
    <h1>My Profile</h1>

    <div class="row">
      <div class="col-md-6 mb-3">
        <v-text-field
          v-model="attributes.firstName"
          dense
          outlined
          label="First name"
          readonly
          hide-details
        ></v-text-field>
      </div>
      <div class="col-md-6 mb-3">
        <v-text-field
          v-model="attributes.lastName"
          dense
          outlined
          label="Last name"
          readonly
          hide-details
        ></v-text-field>
      </div>

      <div class="col-md-6 mb-3">
        <v-text-field
          v-model="attributes.email"
          outlined
          dense
          label="Email"
          readonly
          hide-details
        ></v-text-field>
      </div>
      <div class="col-md-6">
        <v-text-field
          v-model="attributes.username"
          outlined
          dense
          label="Username"
          readonly
          hide-details
        ></v-text-field>
      </div>

      <div class="col-md-6">
        <h2>Roles</h2>

        <v-chip
          v-for="(role, index) in attributes.roles"
          :key="index"
          class="ma-2"
          color="info"
        >
          {{ formatRole(role) }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
  name: "UserProfilePage",
  data: () => ({}),
  computed: {
    ...mapState("currentUser", ["attributes"]),
  },
  async mounted() {
    await this.initialize()
  },
  methods: {
    ...mapActions("currentUser", ["initialize"]),
    formatRole(value) {
      return this.$t(`global.role.${value}`, { $default: `Unknown: ${value}` })
    },
  },
}
</script>
