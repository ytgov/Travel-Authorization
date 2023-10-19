<template>
  <div>
    <div class="d-flex justify-space-between align-baseline my-5">
      <h1>My Travel</h1>
      <CreateTravelAuthorizationButton />
    </div>

    <MyTravelAuthorizationsTable />
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
  methods: {},
  watch: {},
}
</script>
