<template>
  <div class="mt-4">
    <EstimatesTable
      ref="estimatesTable"
      :form-id="formIdAsNumber"
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
    formId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({}),
  computed: {
    formIdAsNumber() {
      return parseInt(this.formId)
    },
  },
  async mounted() {},
  methods: {},
}
</script>
