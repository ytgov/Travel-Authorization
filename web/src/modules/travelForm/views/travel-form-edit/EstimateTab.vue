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

import EstimateCreateDialog from "./estimate-tab/EstimateCreateDialog"
import EstimateGenerateDialog from "./estimate-tab/EstimateGenerateDialog"
import EstimatesTable from "./estimate-tab/EstimatesTable"

export default {
  name: "EstimateTab",
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
    ...mapState("travelForm", ["estimates", "loadingEstimates"]),
    formIdAsNumber() {
      return parseInt(this.formId)
    },
    hasEstimates() {
      return this.loadingEstimates === false && this.estimates.length > 0
    },
  },
  async mounted() {
    await this.loadEstimates({ formId: this.formId })
  },
  methods: {
    ...mapActions("travelForm", ["loadEstimates"]),
    refreshEstimates() {
      this.$refs.estimatesTable.refresh()
    },
  },
}
</script>
