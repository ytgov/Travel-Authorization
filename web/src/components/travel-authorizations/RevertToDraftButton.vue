<template>
  <v-btn
    v-if="isRevertible"
    :loading="isLoading"
    v-bind="$attrs"
    v-on="$listeners"
    @click="revertToDraftAndRedirect"
  >
    Revert to Draft
  </v-btn>
</template>

<script setup>
import { computed, ref, toRefs } from "vue"
import { useRouter } from "vue2-helpers/vue-router"

import { useSnack } from "@/plugins/snack-plugin"
import travelAuthorizationApi, { STATUSES } from "@/api/travel-authorizations-api"
import useTravelAuthorization from "@/use/use-travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const isRevertible = computed(() => {
  return travelAuthorization.value.status === STATUSES.SUBMITTED
})

const isLoading = ref(false)
const router = useRouter()
const snack = useSnack()

async function revertToDraftAndRedirect() {
  isLoading.value = true
  try {
    await travelAuthorizationApi.revertToDraft(props.travelAuthorizationId)
    return router.push({
      name: "EditMyTravelAuthorizationDetailsPage",
      params: {
        travelAuthorizationId: props.travelAuthorizationId,
      },
    })
  } catch (error) {
    console.error(error)
    snack(`Failed to revert to draft: ${error}`, {
      color: "error",
    })
  } finally {
    isLoading.value = false
  }
}
</script>
