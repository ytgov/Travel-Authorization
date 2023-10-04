<template>
  <div class="mt-4">
    <div class="d-flex justify-end">
      <EstimateCreateDialog :form-id="formIdAsNumber" />
    </div>

    <EstimatesTable :form-id="formIdAsNumber" />
  </div>
</template>

<script>
import EstimateCreateDialog from "./estimate-tab/EstimateCreateDialog"
import EstimatesTable from "./estimate-tab/EstimatesTable"

export default {
  name: "EstimateTab",
  components: {
    EstimateCreateDialog,
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
