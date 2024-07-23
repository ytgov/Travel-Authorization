<template>
  <v-container>
    <h2>Meals and Incidental Expenses for Employees on Travel Status</h2>

    <v-card>
      <v-card-title><h3>Full days on travel status</h3></v-card-title>
      <v-card-text> The amount claimed up to a maximum of: </v-card-text>
      <FullDayPerDiemsDataTable />
      <v-card-text
        >For travel outside Canada and USA, refer to
        <a
          href="https://www.njc-cnm.gc.ca/directive/d10/v238/s659/en"
          target="_blank"
          >Canada's National Joint Council travel directive, Appendix C</a
        >.</v-card-text
      >
    </v-card>

    <v-card class="mt-6">
      <v-card-title><h3>Partial days on travel status</h3></v-card-title>
      <v-card-text> The amount claimed up to a maximum of: </v-card-text>
      <EditPartialDaysPerDiemsDataTable />
      <v-card-text
        >For travel outside Canada and USA, refer to
        <a
          href="https://www.njc-cnm.gc.ca/directive/d10/v238/s659/en"
          target="_blank"
          >Canada's National Joint Council travel directive, Appendix C</a
        >.</v-card-text
      >
    </v-card>

    <v-card class="mt-6">
      <v-card-title><h3>Incidental expenses</h3></v-card-title>
      <EditIncidentalPerDiemsDataTable />
    </v-card>

    <v-card class="mt-6">
      <v-card-title><h3>Distance allowance for private vehicle</h3></v-card-title>
      <v-card-text>
        <ul>
          <li><p>70.0 cents (CAD) per kilometer;</p></li>
        </ul>
        <p class="mt-4">
          Refer to
          <a
            href="https://www.njc-cnm.gc.ca/directive/d10/v238/s658/en"
            target="_blank"
            >Canada's National Joint Council travel directive, Appendix B</a
          >.
        </p>
      </v-card-text>
    </v-card>

    <v-card class="mt-6">
      <v-card-title><h3>Private non-commercial accommodation allowance</h3></v-card-title>
      <v-card-text>
        <ul>
          <li><p>$50 CAD per night (In Yukon, NWT and rest of Canada)</p></li>
          <li><p>$50 USD per night (In Alaska and rest of USA)</p></li>
        </ul>
        <p class="mt-4">
          Refer to
          <a
            href="https://www.njc-cnm.gc.ca/directive/app_d.php?lang=en"
            target="_blank"
            >Canada's National Joint Council travel directive, Appendix D</a
          >.
        </p>
        <p></p
      ></v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

import EditIncidentalPerDiemsDataTable from "@/components/per-diems/EditIncidentalPerDiemsDataTable.vue"
import EditPartialDaysPerDiemsDataTable from "@/components/per-diems/EditPartialDaysPerDiemsDataTable.vue"
import FullDayPerDiemsDataTable from "@/components/per-diems/FullDayPerDiemsDataTable.vue"

useBreadcrumbs([
  {
    text: "Administration",
    to: { name: "AdministrationPage" },
  },
  {
    text: "Travel Rates",
    to: { name: "administration/TravelRatesPage" },
  },
])
</script>
