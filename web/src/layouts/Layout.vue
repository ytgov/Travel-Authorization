<template>
  <v-app>
    <LeftSidebarNavigationDrawer
      v-model="showDrawer"
      style="margin-top: 70px"
      app
    />

    <v-app-bar
      app
      color="#fff"
      flat
      height="70"
      style="left: 0; border-bottom: 3px #f3b228 solid"
    >
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <img
        src="/yukon.svg"
        style="margin: -8px 85px 0 0"
        height="44"
      />
      <v-toolbar-title>
        <h1 class="text-h6 font-weight-bold mb-0">{{ applicationName }}</h1>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div>
        <v-btn
          icon
          color="primary"
          class="mr-2"
          title="Recently visited"
          @click="showHistory"
        >
          <v-icon>mdi-history</v-icon>
        </v-btn>

        <span>{{ username }}</span>
        <v-menu
          bottom
          left
          class="ml-0"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              title="System Options"
              icon
              color="primary"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list
            dense
            style="min-width: 200px"
          >
            <v-list-item to="/profile">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My profile</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'AdministrationPage' }">
              <v-list-item-icon>
                <v-icon>mdi-cogs</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Administration</v-list-item-title>
            </v-list-item>

            <v-divider />
            <v-list-item :to="{ name: 'HealthCheck' }">
              <v-list-item-icon>
                <v-icon>mdi-clock</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ releaseTag || "2023.11.01" }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="signOut">
              <v-list-item-icon>
                <v-icon>mdi-exit-run</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sign out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight"></v-app-bar-nav-icon> -->
    </v-app-bar>

    <v-main :style="{ 'padding-left: 33px !important': !hasSidebar }">
      <!-- Provides the application the proper gutter -->
      <v-container
        fluid
        class="h-full"
      >
        <router-view></router-view>
        <RequestAlert />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref } from "vue"
import { mapState } from "vuex"

import { RELEASE_TAG, APPLICATION_NAME, HAS_SIDEBAR, HAS_SIDEBAR_CLOSABLE } from "@/config"
import { auth0 } from "@/plugins/auth0-plugin"
import store from "@/store"

import useVuetify2 from "@/use/utils/use-vuetify2"
import useCurrentUser from "@/use/use-current-user"

import RequestAlert from "@/components/RequestAlert.vue"
import LeftSidebarNavigationDrawer from "@/components/layout/LeftSidebarNavigationDrawer.vue"

const { unset: unsetCurrentUser } = useCurrentUser()

export default {
  name: "App",
  components: {
    RequestAlert,
    LeftSidebarNavigationDrawer,
  },
  setup() {
    const { lgAndUp } = useVuetify2()

    const showDrawer = ref(lgAndUp.value)

    function toggleDrawer() {
      showDrawer.value = !showDrawer.value
    }

    return {
      showDrawer,
      toggleDrawer,
    }
  },
  data: () => ({
    releaseTag: RELEASE_TAG,
    dialog: false,
    drawer: null,
    drawerRight: null,
    headerShow: false,
    menuShow: false,
    loadingClass: "d-none",
    applicationName: APPLICATION_NAME,
    hasSidebar: HAS_SIDEBAR,
    hasSidebarClosable: HAS_SIDEBAR_CLOSABLE,
    currentId: 0,
    menuTitle: "Dashboard",
  }),
  computed: {
    ...mapState(["user"]),
    username() {
      return store.getters.fullName
    },
    user() {
      return store.getters.user
    },
  },
  methods: {
    signOut() {
      unsetCurrentUser()

      const returnTo = encodeURI(window.location.origin + "/sign-in")
      return auth0.logout({
        logoutParams: {
          returnTo,
        },
      })
    },
    showHistory() {
      this.$refs.historySidebar.show()
    },
  },
}
</script>

<style scoped>
.h-full {
  height: 100%;
}
</style>
