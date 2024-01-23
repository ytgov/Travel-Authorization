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
          :validate-form="validate"
        />
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <SaveDraftButton
        :travel-authorization-id="travelAuthorizationId"
        :validate="validate"
      />
      <!-- TODO: re-add back button once travel authorizatons page exists -->
      <!-- <v-btn
        class="ml-3"
        color="secondary"
        :to="{ name: 'TravelAuthorizationsPage' }"
        >Back</v-btn
      > -->
    </div>
  </v-form>
</template>

<script setup>
import { ref } from "vue"

import PurposeFormCard from "@/modules/travel-authorizations/components/edit-travel-authorization-details-page/PurposeFormCard"
import DetailsFormCard from "@/modules/travel-authorizations/components/edit-travel-authorization-details-page/DetailsFormCard"
import ApprovalsFormCard from "@/modules/travel-authorizations/components/edit-my-travel-authorization-details-page/ApprovalsFormCard"

import SaveDraftButton from "@/modules/travel-authorizations/components/edit-travel-authorization-details-page/SaveDraftButton"

defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

/** @type {import('vue').Ref<{ validate: () => boolean } | null>} */
const form = ref(null)

function validate() {
  return form.value.validate()
}
</script>
