<template>
  <v-form
    ref="form"
    class="mt-4"
    lazy-validation
  >
    <v-row>
      <v-col>
        <PurposeFormCard :travel-authorization-id="travelAuthorizationIdAsNumber" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DetailsFormCard :travel-authorization-id="travelAuthorizationIdAsNumber" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ApprovalsFormCard
          :travel-authorization-id="travelAuthorizationIdAsNumber"
          :validate-form="validateForm"
        />
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <SaveDraftButton
        :travel-authorization-id="travelAuthorizationIdAsNumber"
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

<script setup>
import { computed, ref } from "vue"

import PurposeFormCard from "@/modules/travel-authorizations/components/edit-my-travel-authorization-details-page/PurposeFormCard"
import DetailsFormCard from "@/modules/travel-authorizations/components/edit-my-travel-authorization-details-page/DetailsFormCard"
import ApprovalsFormCard from "@/modules/travel-authorizations/components/edit-my-travel-authorization-details-page/ApprovalsFormCard"

import SaveDraftButton from "@/modules/travel-authorizations/components/edit-my-travel-authorization-details-page/SaveDraftButton"

/**
 * @template [T=any]
 * @typedef {import("vue").Ref<T>} Ref
 */
/** @typedef {import('vuetify/lib/components/VForm').VForm} VForm */

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

/** @type {Ref<InstanceType<typeof VForm> | null>} */
const form = ref(null)

function validateForm() {
  if (form.value?.validate()) return true

  return false
}
</script>
