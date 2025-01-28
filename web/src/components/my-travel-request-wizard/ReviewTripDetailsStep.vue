<template>
  <div>
    <v-row>
      <v-col>
        <PurposeCard :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DetailsCard :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ApprovalsCard :travel-authorization-id="travelAuthorizationId" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from "vue"

import { useSnack } from "@/plugins/snack-plugin"
import travelAuthorizationApi from "@/api/travel-authorizations-api"

import PurposeCard from "@/components/travel-authorizations/PurposeCard.vue"
import DetailsCard from "@/components/travel-authorizations/DetailsCard.vue"
import ApprovalsCard from "@/components/travel-authorizations/ApprovalsCard.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const isLoading = ref(false)
const snack = useSnack()

async function initialize(context) {
  context.setEditableSteps([])
}

async function revertToDraft() {
  isLoading.value = true
  try {
    await travelAuthorizationApi.revertToDraft(props.travelAuthorizationId)
    snack.success("Travel request reverted to draft.")
    return true
  } catch (error) {
    console.error(error)
    snack.error(`Failed to revert to draft: ${error}`)
    return false
  } finally {
    isLoading.value = false
  }
}

defineExpose({
  initialize,
  back: revertToDraft,
})
</script>
