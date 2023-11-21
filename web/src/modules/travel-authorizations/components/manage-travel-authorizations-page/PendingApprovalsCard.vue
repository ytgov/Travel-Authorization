<template>
  <v-card
    class="mt-5"
    color="#fff2d5"
  >
    <v-card-title>
      Pending Approvals
      <RefreshTableButton @click="refreshTable" />
    </v-card-title>
    <v-card-text>
      <SupervisorTravelAuthorizationsByStatusTable
        ref="table"
        :status="STATUSES.SUBMITTED"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { STATUSES } from "@/api/travel-authorizations-api"

import SupervisorTravelAuthorizationsByStatusTable from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/SupervisorTravelAuthorizationsByStatusTable"
import RefreshTableButton from "@/modules/travel-authorizations/components/manage-travel-authorizations-page/RefreshTableButton"

export default {
  name: "PendingApprovalsCard",
  components: {
    RefreshTableButton,
    SupervisorTravelAuthorizationsByStatusTable,
  },
  data: () => ({
    STATUSES,
  }),
  methods: {
    refreshTable() {
      this.$refs.table.refresh()
    },
  },
}
</script>
