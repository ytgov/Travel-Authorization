<template>
  <PurposeEditFormCard
    ref="purposeEditFormCard"
    :travel-authorization-id="travelAuthorizationIdAsNumber"
  />
</template>

<script setup>
import { computed, ref } from "vue"

import { useSnack } from "@/plugins/snack-plugin"

import PurposeEditFormCard from "@/components/travel-authorizations/PurposeEditFormCard.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(["updated"])

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

const isLoading = ref(false)
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
    emit("updated", travelAuthorizationIdAsNumber.value)
    return true
  } catch (error) {
    snack.error(error.message)
  } finally {
    isLoading.value = false
  }
}

defineExpose({
  continue: validateAndSave,
})
</script>
