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
            <TravelAuthorizationsDashboardWidget :status="STATUSES.SUBMITTED" />
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
            <TravelAuthorizationsDashboardWidget :status="STATUSES.CHANGE_REQUESTED" />
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
            <TravelAuthorizationsDashboardWidget :status="STATUSES.EXPENSE_CLAIM" />
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
            <TravelAuthorizationsDashboardWidget :status="STATUSES.APPROVED" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { STATUSES } from "@/api/travel-authorizations-api"
import TravelAuthorizationsDashboardWidget from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/TravelAuthorizationsDashboardWidgetTable"

export default {
  name: "ManageTravelAuthorizationsPage",
  components: {
    TravelAuthorizationsDashboardWidget,
  },
  data: () => ({
    STATUSES,
  }),
  methods: {},
}
</script>
