<template>
  <div class="mt-4">
    <EstimatesTable
      ref="estimatesTable"
      :travel-authorization-id="travelAuthorizationId"
    />
  </div>
</template>

<script>
import EstimatesTable from "@/modules/travel-authorizations/components/read-my-travel-authorization-estimate-page/EstimatesTable"

export default {
  name: "ReadMyTravelAuthorizationEstimatePage",
  components: {
    EstimatesTable,
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({}),
  computed: {},
  async mounted() {},
  methods: {},
}
</script>
