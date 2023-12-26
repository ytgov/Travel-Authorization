<template>
  <v-form
    ref="form"
    class="mt-4"
    lazy-validation
  >
    <v-row>
      <v-col>
        <PurposeFormCard :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DetailsFormCard :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ApprovalsFormCard
          :travel-authorization-id="travelAuthorizationId"
          :validate-form="validateForm"
        />
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <SaveDraftButton
        :travel-authorization-id="travelAuthorizationId"
        :validate-form="validateForm"
      />
      <v-btn
        class="ml-3"
        color="secondary"
        :to="{ name: 'MyTravelAuthorizationsPage' }"
        >Back</v-btn
      >
    </div>
  </v-form>
</template>

<script>
import store from "@/store"

import PurposeFormCard from "@/modules/travel-authorizations/components/edit-my-travel-authorization-details-page/PurposeFormCard"
import DetailsFormCard from "@/modules/travel-authorizations/components/edit-my-travel-authorization-details-page/DetailsFormCard"
import ApprovalsFormCard from "@/modules/travel-authorizations/components/edit-my-travel-authorization-details-page/ApprovalsFormCard"

import SaveDraftButton from "@/modules/travel-authorizations/components/edit-my-travel-authorization-details-page/SaveDraftButton"

export default {
  name: "EditMyTravelAuthorizationDetailsPage",
  components: {
    PurposeFormCard,
    DetailsFormCard,
    ApprovalsFormCard,
    SaveDraftButton,
  },
  // CONSIDER: Should I just put this in the mounted hook?
  // Or if if I should controll this problem by never showing the edit link to a user if they can't edit?
  async beforeRouteEnter(to, _from, next) {
    if (to.name !== "EditMyTravelAuthorizationDetailsPage") {
      return next()
    }

    await store.dispatch("current/user/ensure")
    await store.dispatch("travelAuthorization/ensure", to.params.travelAuthorizationId)

    if (store.getters["travelAuthorization/isEditable"]) {
      return next()
    }

    next({
      name: "ReadMyTravelAuthorizationDetailsPage",
      params: { travelAuthorizationId: this.travelAuthorizationId },
    })
  },
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    validateForm() {
      if (this.$refs.form.validate()) return true

      return false
    },
  },
}
</script>
