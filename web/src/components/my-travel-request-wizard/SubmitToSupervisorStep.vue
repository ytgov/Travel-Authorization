<template>
  <div>
    <v-row>
      <v-col>
        <PurposeCard :travel-authorization-id="travelAuthorizationIdAsNumber" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DetailsCard :travel-authorization-id="travelAuthorizationIdAsNumber" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ApprovalsEditFormCard
          ref="approvalsEditFormCard"
          :travel-authorization-id="travelAuthorizationIdAsNumber"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"

import { useSnack } from "@/plugins/snack-plugin"

import PurposeCard from "@/components/travel-authorizations/PurposeCard.vue"
import DetailsCard from "@/components/travel-authorizations/DetailsCard.vue"
import ApprovalsEditFormCard from "@/components/travel-authorizations/ApprovalsEditFormCard.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(["updated"])

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

async function initialize(context) {
  context.setEditableSteps(["edit-purpose-details", "edit-trip-details", "generate-estimate"])
}

const isLoading = ref(false)
/** @type {import('vue').Ref<InstanceType<typeof ApprovalsEditFormCard> | null>} */
const approvalsEditFormCard = ref(null)
const snack = useSnack()

async function validateAndSave() {
  isLoading.value = true
  try {
    if (approvalsEditFormCard.value.validate() === false) {
      snack.error("Please fill in all required fields.")
      return false
    }

    await approvalsEditFormCard.value.save()
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
  initialize,
  continue: validateAndSave,
})
</script>
