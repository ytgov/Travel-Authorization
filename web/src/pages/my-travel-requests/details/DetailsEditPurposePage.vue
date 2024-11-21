<template>
  <v-container>
    <v-row>
      <v-col>
        <PurposeFormCard
          ref="purposeFormCard"
          :travel-authorization-id="travelAuthorizationIdAsNumber"
        />
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <v-btn
        color="secondary"
        :to="{
          name: 'my-travel-requests/MyTravelRequestsPage',
        }"
        >Back</v-btn
      >
      <v-btn
        class="ml-3"
        :loading="isLoading"
        color="primary"
        @click="saveWrapper"
      >
        Continue
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { computed, ref, toRefs } from "vue"
import { useRouter } from "vue2-helpers/vue-router"

import { useSnack } from "@/plugins/snack-plugin"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useTravelAuthorization from "@/use/use-travel-authorization"

import PurposeFormCard from "@/components/travel-authorizations/PurposeEditFormCard.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(["state-changed"])

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization, isLoading } = useTravelAuthorization(travelAuthorizationId)

const purposeFormCard = ref(null)
const snack = useSnack()
const router = useRouter()

async function saveWrapper() {
  isLoading.value = true
  try {
    if (purposeFormCard.value.validate() === false) {
      snack.error("Please fill in all required fields.")
      return
    }

    await purposeFormCard.value.save({
      stepNumber: 2,
    })
    snack.success("Travel request saved.")
    emit("state-changed", travelAuthorization.value.id)
    return router.push({
      name: "my-travel-requests/details/DetailsEditPage",
      params: {
        travelAuthorizationId: props.travelAuthorizationId,
      },
    })
  } catch (error) {
    snack.error(error.message)
  } finally {
    isLoading.value = false
  }
}

const travelAuthorizationEventName = computed(() => {
  if (isLoading.value) {
    return "loading ..."
  }

  return travelAuthorization.value?.eventName || "New Travel Request"
})
const breadcrumbs = computed(() => [
  {
    text: "My Travel Requests",
    to: {
      name: "my-travel-requests/MyTravelRequestsPage",
    },
  },
  {
    text: travelAuthorizationEventName.value,
    to: {
      name: "my-travel-requests/details/DetailsPage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
  },
  {
    text: "Edit",
    to: {
      name: "my-travel-requests/details/DetailsEditPurposePage",
      params: { travelAuthorizationId: travelAuthorizationId.value },
    },
  },
])
useBreadcrumbs(breadcrumbs)
</script>
