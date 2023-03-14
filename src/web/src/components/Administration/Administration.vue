<template>
  <v-app>
    <v-container fluid>
      <H1>Administration</H1>
      <v-card>
        <v-card-title>User Management</v-card-title>
        <v-list class="pb-0 pt-0">
          <v-list-item-group v-model="usermodel">
            <v-list-item @click="goTo('/administration/users')">
              <v-list-item-icon>
                <v-icon v-text="'mdi-account-group'"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>User Management</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
      <v-card>
        <v-card-title>Rates and Estimates</v-card-title>
        <v-list class="pb-0 pt-0">
          <v-list-item-group v-model="tablemodel">
            <v-list-item v-for="(item, i) in items" :key="i" @click="goTo(item.url)">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
      <v-card>
        <v-card-title>Look up Management</v-card-title>
        <v-list class="pb-0 pt-0">
          <v-list-item-group v-model="tablemodel">
            <v-list-item v-for="(lookup, i) in lookups" :key="i" @click="goTo(lookup.url)">
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
    </v-container>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    icon: null,
    usermodel: null,
    tablemodel: null,
    items: [
      {
        icon: "mdi-wallet-membership",
        text: "Flight Estimate",
        url: "/administration/FlightEstimate"
      },
      {
        icon: "mdi-database",
        text: "Pool Car Costs",
        url: "/administration/PoolCarCost"
      },
      {
        icon: "mdi-shape",
        text: "Rental Car Estimates",
        url: "/administration/RentalCarEstimates"
      },
      {
        icon: "mdi-bug",
        text: "YG Rates",
        url: "/administration/YGRates"
      }
    ],
    lookups: [
      {
        icon: "mdi-wallet-membership",
        text: "Purpose",
        url: "/administration/Purpose"
      },
      {
        icon: "mdi-airplane",
        text: "Travel Agents",
        url: "/administration/TravelAgents"
      }
    ],
    model: 1
  }),
  methods: {
    goTo(url) {
      if (url == "") return;
      this.$router.push(url);
    }
  }
};
</script>
