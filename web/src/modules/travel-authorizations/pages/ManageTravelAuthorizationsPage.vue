<template>
  <div>
    <h1>Manage Submissions</h1>
    <v-row>
      <v-col>
        <v-card
          class="mt-5"
          color="#fff2d5"
        >
          <v-card-title>Pending Approvals</v-card-title>
          <v-card-text>
            <SupervisorTravelAuthorizationsByStatusTable :status="STATUSES.SUBMITTED" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <v-card
          class="mt-5"
          color="#fff2d5"
        >
          <v-card-title>Awaiting changes</v-card-title>
          <v-card-text>
            <SupervisorTravelAuthorizationsByStatusTable :status="STATUSES.CHANGE_REQUESTED" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card
          class="mt-5"
          color="#fff2d5"
        >
          <v-card-title>Awaiting Expense Approval</v-card-title>
          <v-card-text>
            <!-- TODO: double check this status is the one intended -->
            <SupervisorTravelAuthorizationsByStatusTable :status="STATUSES.EXPENSE_CLAIM" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          class="mt-5"
          color="#fff2d5"
        >
          <v-card-title>Approved Trips</v-card-title>
          <v-card-text>
            <SupervisorTravelAuthorizationsByStatusTable :status="STATUSES.APPROVED" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { STATUSES } from "@/api/travel-authorizations-api"

import SupervisorTravelAuthorizationsByStatusTable from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/SupervisorTravelAuthorizationsByStatusTable"

export default {
  name: "ManageTravelAuthorizationsPage",
  components: {
    SupervisorTravelAuthorizationsByStatusTable,
  },
  data: () => ({
    STATUSES,
  }),
  methods: {},
}
</script>
