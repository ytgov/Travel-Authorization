<template>
  <div class="mt-4">
    <div class="d-flex justify-end">
      <EstimateCreateDialog
        v-if="hasEstimates"
        :form-id="formIdAsNumber"
        @created="refreshEstimates"
      />
      <EstimateGenerateDialog
        v-else
        :form-id="formIdAsNumber"
        @created="refreshEstimates"
      />
    </div>

    <EstimatesTable
      ref="estimatesTable"
      :form-id="formIdAsNumber"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"

import EstimateCreateDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-estimate-page/EstimateCreateDialog"
import EstimateGenerateDialog from "@/modules/travel-authorizations/components/edit-my-travel-authorization-estimate-page/EstimateGenerateDialog"
import EstimatesTable from "@/modules/travel-authorizations/components/edit-my-travel-authorization-estimate-page/EstimatesTable"

export default {
  name: "EditMyTravelAuthorizationEstimatePage",
  components: {
    EstimateCreateDialog,
    EstimateGenerateDialog,
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
    ...mapState("travelAuthorizations", ["estimates", "loadingEstimates"]),
    formIdAsNumber() {
      return parseInt(this.formId)
    },
    hasEstimates() {
      return this.loadingEstimates === false && this.estimates.length > 0
    },
  },
  async mounted() {
    await this.loadEstimates({ travelAuthorizationId: this.formId })
  },
  methods: {
    ...mapActions("travelAuthorizations", ["loadEstimates"]),
    refreshEstimates() {
      this.$refs.estimatesTable.refresh()
    },
  },
}
</script>
