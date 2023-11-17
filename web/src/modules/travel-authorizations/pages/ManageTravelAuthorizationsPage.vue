<template>
  <div>
    <Breadcrumbs class="mb-2" />

    <h1>Manage Submissions</h1>
    <v-row>
      <v-col>
        <PendingApprovalsCard />
      </v-col>
      <v-col>
        <AwaitingChangesCard />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AwaitingExpenseApprovalCard />
      </v-col>
      <v-col>
        <ApprovedTripsCard />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs"

import ApprovedTripsCard from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/ApprovedTripsCard"
import AwaitingChangesCard from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/AwaitingChangesCard"
import AwaitingExpenseApprovalCard from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/AwaitingExpenseApprovalCard"
import PendingApprovalsCard from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/PendingApprovalsCard"

export default {
  name: "ManageTravelAuthorizationsPage",
  components: {
    ApprovedTripsCard,
    AwaitingChangesCard,
    AwaitingExpenseApprovalCard,
    Breadcrumbs,
    PendingApprovalsCard,
  },
  data: () => ({}),
  methods: {},
}
</script>
