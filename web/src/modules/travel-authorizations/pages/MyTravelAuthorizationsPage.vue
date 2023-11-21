<template>
  <div>
    <Breadcrumbs />

    <div class="d-flex justify-space-between align-baseline my-5">
      <h1>
        My Travel
        <v-btn
          class="ma-0 ml-1"
          icon
          color="green"
          title="Refresh Table"
          @click="refresh"
        >
          <v-icon>mdi-cached</v-icon>
        </v-btn>
      </h1>
      <CreateTravelAuthorizationButton />
    </div>

    <MyTravelAuthorizationsTable ref="table" />
  </div>
</template>
<script>
import Breadcrumbs from "@/components/Breadcrumbs"

import CreateTravelAuthorizationButton from "@/modules/travel-authorizations/components/my-travel-authorizations-page/CreateTravelAuthorizationButton"
import MyTravelAuthorizationsTable from "@/modules/travel-authorizations/components/MyTravelAuthorizationsTable"

export default {
  name: "MyTravelAuthorizationsPage",
  components: {
    Breadcrumbs,
    CreateTravelAuthorizationButton,
    MyTravelAuthorizationsTable,
  },
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refreshForms()
    },
  },
}
</script>
