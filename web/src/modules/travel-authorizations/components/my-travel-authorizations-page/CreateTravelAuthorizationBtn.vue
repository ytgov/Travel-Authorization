<template>
  <v-btn
    :loading="isLoading"
    :color="color"
    @click="createAndGoToEditPage"
  >
    New Travel Request
  </v-btn>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue2-helpers/vue-router"

import { useSnack } from "@/plugins/snack-plugin"

import { ACCOMMODATION_TYPES, TRAVEL_METHODS } from "@/api/stops-api"
import travelAuthorizationsApi from "@/api/travel-authorizations-api"

import useCurrentUser from "@/use/use-current-user"
import { FIRST_STEP_ID } from "@/use/wizards/my-travel-request-wizard-steps"

defineProps({
  color: {
    type: String,
    default: "primary",
  },
})

const { currentUser } = useCurrentUser()

const isLoading = ref(false)
const router = useRouter()
const snack = useSnack()

async function createAndGoToEditPage() {
  isLoading.value = true
  try {
    const { travelAuthorization } = await travelAuthorizationsApi.create({
      userId: currentUser.value.id,
      wizardStepName: FIRST_STEP_ID,
      stopsAttributes: [
        {
          accommodationType: ACCOMMODATION_TYPES.HOTEL,
          transport: TRAVEL_METHODS.AIRCRAFT,
        },
        {
          transport: TRAVEL_METHODS.AIRCRAFT,
          accommodationType: null,
        },
      ],
    })
    snack.success("Travel request created!")
    return router.push({
      name: "my-travel-requests/MyTravelRequestWizardPage",
      params: {
        travelAuthorizationId: travelAuthorization.id,
        stepName: travelAuthorization.wizardStepName,
      },
    })
  } catch (error) {
    console.error(error)
    snack.error(`Failed to create travel request: ${error}`)
  } finally {
    isLoading.value = false
  }
}
</script>
