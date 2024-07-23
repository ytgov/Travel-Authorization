<template>
  <div>
    <!-- TODO: move this to the layout or App level -->
    <BreadcrumbsBar :items="breadcrumbs" />

    <h1>Administration</h1>

    <v-row>
      <v-col>
        <v-card class="default">
          <v-card-title>User Management</v-card-title>
          <v-list class="pb-0 pt-0">
            <v-list-item-group>
              <v-list-item :to="{ name: 'User Management' }">
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
      <v-col>
        <v-card class="default">
          <v-card-title>Rates and Estimates</v-card-title>
          <v-list class="pb-0 pt-0">
            <v-list-item-group>
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
                :href="item.url"
              >
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="default">
          <v-card-title>Look up Management</v-card-title>
          <v-list class="pb-0 pt-0">
            <v-list-item-group>
              <v-list-item
                v-for="(lookup, index) in lookups"
                :key="index"
                :href="lookup.url"
              >
                <v-list-item-icon>
                  <v-icon>{{ lookup.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ lookup.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue"

const items = [
  {
    icon: "mdi-wallet-membership",
    text: "Flight Estimate",
    url: "/administration/FlightEstimate",
  },
  {
    icon: "mdi-database",
    text: "Pool Car Costs",
    url: "/administration/PoolCarCost",
  },
  {
    icon: "mdi-shape",
    text: "Rental Car Estimates",
    url: "/administration/RentalCarEstimates",
  },
  {
    icon: "mdi-bug",
    text: "YG Rates",
    url: "/administration/YGRates",
  },
]

const lookups = [
  {
    icon: "mdi-wallet-membership",
    text: "Purpose",
    url: "/administration/Purpose",
  },
  {
    icon: "mdi-airplane",
    text: "Travel Agents",
    url: "/administration/TravelAgents",
  },
]

const breadcrumbs = [
  {
    text: "Dasboard",
    to: {
      name: "Dashboard",
    },
  },
  {
    text: "Administration",
    to: {
      name: "AdministrationPage",
    },
  },
]
</script>
