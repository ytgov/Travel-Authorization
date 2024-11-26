<template>
  <PurposeEditFormCard
    ref="purposeEditFormCard"
    :travel-authorization-id="travelAuthorizationIdAsNumber"
  />
</template>

<script setup>
import { computed, ref, toRefs } from "vue"

import { useSnack } from "@/plugins/snack-plugin"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useTravelAuthorization from "@/use/use-travel-authorization"

import PurposeEditFormCard from "@/components/travel-authorizations/PurposeEditFormCard.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(["updated"])

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization, isLoading } = useTravelAuthorization(travelAuthorizationId)

/** @type {import('vue').Ref<InstanceType<typeof PurposeEditFormCard> | null>} */
const purposeEditFormCard = ref(null)
const snack = useSnack()

async function validateAndSave() {
  isLoading.value = true
  try {
    if (purposeEditFormCard.value.validate() === false) {
      snack.error("Please fill in all required fields.")
      return false
    }

    await purposeEditFormCard.value.save()
    snack.success("Travel request saved.")
    emit("updated", travelAuthorization.value.id)
    return true
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

defineExpose({
  continue: validateAndSave,
})
</script>
