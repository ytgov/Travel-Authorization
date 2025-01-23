<template>
  <div>
    <h1 class="d-flex justify-space-between">
      My Profile

      <v-btn
        title="Sync profile with external directory"
        color="primary"
        small
        icon
        @click="ygGovernmentDirectorySync"
      >
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </h1>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="currentUser.firstName"
          label="First name"
          dense
          hide-details
          outlined
          readonly
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="currentUser.lastName"
          label="Last name"
          dense
          hide-details
          outlined
          readonly
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="currentUser.email"
          label="Email"
          dense
          hide-details
          outlined
          readonly
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="formatStatus(currentUser.status)"
          label="Status"
          dense
          hide-details
          outlined
          readonly
        ></v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="currentUser.manager"
          label="Manager"
          dense
          hide-details
          outlined
          readonly
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="currentUser.mailcode"
          label="Mail code"
          dense
          hide-details
          outlined
          readonly
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="currentUser.department"
          label="Department"
          dense
          hide-details
          outlined
          readonly
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="currentUser.division"
          label="Division"
          dense
          hide-details
          outlined
          readonly
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="currentUser.branch"
          label="Branch"
          dense
          hide-details
          outlined
          readonly
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :value="currentUser.unit"
          label="Unit"
          dense
          hide-details
          outlined
          readonly
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <h2>Roles</h2>

        <v-chip
          v-for="(role, index) in currentUser.roles"
          :key="index"
          class="ma-2"
          color="info"
        >
          {{ formatRole(role) }}
        </v-chip>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useI18n } from "@/plugins/vue-i18n-plugin"

import usersApi from "@/api/users-api"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"
import useSnack from "@/use/use-snack"

const { currentUser, isLoading } = useCurrentUser()

const { t } = useI18n()
const snack = useSnack()

async function ygGovernmentDirectorySync() {
  isLoading.value = true
  try {
    await usersApi.ygGovernmentDirectorySync(currentUser.value.id)
    snack.success("Current user synced with the YG government directory.")
  } catch (error) {
    console.error(`Failed to sync current user with the YG government directory: ${error}`)
    snack.error("Failed to sync current user with the YG government directory.")
  } finally {
    isLoading.value = false
  }
}

function formatRole(value) {
  return t(`role.name.${value}`, { $default: value })
}

function formatStatus(value) {
  return t(`global.status.${value}`, { $default: value })
}

useBreadcrumbs([
  {
    text: "Profile",
    to: {
      name: "ProfilePage",
    },
  },
])
</script>
