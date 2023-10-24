<template>
  <div>
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
import CreateTravelAuthorizationButton from "@/modules/travel-form/views/travel-form-list/CreateTravelAuthorizationButton"
import MyTravelAuthorizationsTable from "@/modules/travel-form/components/MyTravelAuthorizationsTable"

export default {
  name: "TravelFormList",
  components: {
    CreateTravelAuthorizationButton,
    MyTravelAuthorizationsTable,
  },
  data: () => ({}),
  mounted() {},
  computed: {},
  methods: {
    refresh() {
      this.$refs.table.refreshForms()
    },
  },
  watch: {},
}
</script>
