<template>
  <div>
    <Breadcrumbs />
    <h1>Administration</h1>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Administration</v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list class="pb-0 pt-0">
            <v-list-item-group v-model="usermodel">
              <v-list-item @click="goTo('/admin/users')">
                <v-list-item-icon>
                  <v-icon>mdi-account-group</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>User Management</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Rates and Estimate Management</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-list class="pb-0 pt-0">
              <v-list-item-group v-model="estimatemodel">
                <v-list-item
                  v-for="(item, i) in items"
                  :key="i"
                  @click="goTo(item.url)"
                >
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-toolbar>
        </v-card>
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Look-up Table Management</v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list class="pb-0 pt-0">
            <v-list-item-group v-model="tablemodel">
              <v-list-item
                v-for="(lookup, i) in lookups"
                :key="i"
                @click="goTo(lookup.url)"
              >
                <v-list-item-icon>
                  <v-icon v-text="lookup.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="lookup.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Breadcrumbs from "../Breadcrumbs"
export default {
  components: {
    Breadcrumbs,
  },
  data: () => ({
    icon: null,
    usermodel: null,
    tablemodel: null,
    estimatemodel: null,
    items: [
      {
        icon: "mdi-wallet-membership",
        text: "Flight Estimate",
        url: "/admin/AirEstimate",
      },
      {
        icon: "mdi-database",
        text: "Pool Car Costs",
        url: "/admin/PoolCarCost",
      },
      {
        icon: "mdi-shape",
        text: "Rental Car Estimate",
        url: "/admin/RentalCarEstimate",
      },
      {
        icon: "mdi-bug",
        text: "YG Rates",
        url: "/admin/YGRates",
      },
    ],
    lookups: [
      {
        icon: "mdi-wallet-membership",
        text: "Purpose",
        url: "/admin/Purpose",
      },
    ],
    model: 1,
  }),
  methods: {
    goTo(url) {
      if (url == "") return
      this.$router.push(url)
    },
  },
}
</script>
