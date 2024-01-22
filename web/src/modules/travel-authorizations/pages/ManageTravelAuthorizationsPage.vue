<template>
  <div>
    <Breadcrumbs class="mb-2" />

    <div class="d-flex justify-space-between align-baseline">
      <h1>Manage Submissions</h1>
      <CreateTravelAuthorizationDialogButton />
    </div>
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

<script setup>
import Breadcrumbs from "@/components/Breadcrumbs"

import ApprovedTripsCard from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/ApprovedTripsCard"
import AwaitingChangesCard from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/AwaitingChangesCard"
import AwaitingExpenseApprovalCard from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/AwaitingExpenseApprovalCard"
import CreateTravelAuthorizationDialogButton from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/CreateTravelAuthorizationDialogButton"
import PendingApprovalsCard from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/PendingApprovalsCard"
</script>
