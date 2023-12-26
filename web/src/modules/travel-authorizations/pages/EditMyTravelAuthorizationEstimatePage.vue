<template>
  <div class="mt-4">
    <div class="d-flex justify-end">
      <EstimateCreateDialog
        v-if="hasEstimates"
        :travel-authorization-id="travelAuthorizationId"
        @created="refreshEstimates"
      />
      <EstimateGenerateDialog
        v-else
        :travel-authorization-id="travelAuthorizationId"
        @created="refreshEstimates"
      />
    </div>

    <EstimatesTable
      ref="estimatesTable"
      :travel-authorization-id="travelAuthorizationId"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

import { TYPES } from "@/api/expenses-api"
import store from "@/store"

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
  // CONSIDER: Should I just put this in the mounted hook?
  // Or if if I should controll this problem by never showing the edit link to a user if they can't edit?
  async beforeRouteEnter(to, _from, next) {
    if (to.name !== "EditMyTravelAuthorizationEstimatePage") {
      return next()
    }

    await store.dispatch("current/user/ensure")
    await store.dispatch("travelAuthorization/ensure", to.params.travelAuthorizationId)

    if (store.getters["travelAuthorization/isEditable"]) {
      return next()
    }

    next({
      name: "ReadMyTravelAuthorizationEstimatePage",
      params: { travelAuthorizationId: this.travelAuthorizationId },
    })
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({}),
  computed: {
    ...mapGetters("expenses", ["items", "isLoading"]),
    hasEstimates() {
      return this.isLoading === false && this.items.length > 0
    },
  },
  async mounted() {
    await this.ensure({
      where: {
        travelAuthorizationId: this.travelAuthorizationId,
        type: TYPES.ESTIMATE,
      },
    })
  },
  methods: {
    ...mapActions("expenses", ["ensure"]),
    refreshEstimates() {
      this.$refs.estimatesTable.refresh()
    },
  },
}
</script>
