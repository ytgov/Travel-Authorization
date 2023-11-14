<template>
  <v-menu
    v-model="menu"
    bottom
    right
    transition="scale-transition"
    origin="top left"
  >
    <template #activator="{ on }">
      <v-chip
        class="d-flex-inline justify-center"
        style="min-width: 150px"
        color="teal"
        text-color="white"
        pill
        v-on="on"
      >
        <v-progress-circular
          v-if="isLoading"
          size="20"
          width="2"
          color="white"
          indeterminate
        ></v-progress-circular>
        <template v-else> {{ user.firstName }} {{ user.lastName }} </template>
      </v-chip>
    </template>

    <v-card width="300">
      <v-list dark>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="gravatarUrl"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ user.firstName }} {{ user.lastName }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              icon
              :to="userProfileLink"
            >
              <v-icon>mdi-link</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-list dense>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ user.email }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <template v-for="(field, index) in fields">
          <v-list-item
            v-if="user[field]"
            :key="index"
          >
            <v-list-item-content>
              <v-list-item-subtitle>{{ user[field] }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import MD5 from "md5.js"
import { isNil } from "lodash"

import usersApi from "@/api/users-api"

const UNSET_USER_ID = -1

export default {
  name: "VUserChipMenu",
  props: {
    userId: {
      type: Number,
      default: UNSET_USER_ID,
    },
    isCurrentUser: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    menu: false,
    user: {},
    isInitialized: false,
    isLoading: false,
    isErrored: false,
    fields: ["manager", "mailcode", "department", "division", "branch", "unit"],
  }),
  computed: {
    gravatarUrl() {
      if (isNil(this.user.email)) {
        return ""
      }

      const normalizedEmail = this.user.email.trim().toLowerCase()
      const hash = new MD5().update(normalizedEmail).digest("hex")
      return `https://www.gravatar.com/avatar/${hash}`
    },
    userProfileLink() {
      return this.isCurrentUser ? "/profile" : `/users/${this.userId}`
    },
  },
  watch: {
    userId: {
      handler(newValue) {
        if (newValue === UNSET_USER_ID || isNil(newValue)) {
          return
        }

        this.fetchUser(newValue)
      },
      immediate: true,
    },
  },
  methods: {
    async fetchUser(userId) {
      this.isLoading = true
      try {
        const { user } = await usersApi.get(userId)
        this.isErrored = false
        this.user = user
        this.isInitialized = true
      } catch (error) {
        this.isErrored = true
        console.error(`Failed to fetch user id=${userId} because: ${error}`)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
