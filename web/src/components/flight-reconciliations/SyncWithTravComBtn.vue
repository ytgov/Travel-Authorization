<template>
  <v-btn
    :loading="isLoading"
    v-bind="$attrs"
    v-on="$listeners"
    @click="syncWithExternalDatabase"
  >
    Sync with TravCom
  </v-btn>
</template>

<script setup>
import { ref } from "vue"
import { isNil, isEmpty } from "lodash"

import blockedToTrueConfirm from "@/utils/blocked-to-true-confirm"
import flightReconciliationsApi from "@/api/flight-reconciliations-api"
import useSnack from "@/use/use-snack"

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(["synced"])

const isLoading = ref(false)
const snack = useSnack()

async function syncWithExternalDatabase() {
  if (isNil(props.filters) || isEmpty(props.filters)) {
    if (
      !blockedToTrueConfirm(
        "Are you sure you want to sync _all_ of TravCom?\nThis will take a long time."
      )
    )
      return
  }

  isLoading.value = true
  try {
    await flightReconciliationsApi.sync({
      filters: props.filters,
    })
    emit("synced")
    snack.success("Synced with TravCom.")
  } catch (error) {
    console.error(`Failed to sync with TravCom: ${error}`, { error })
    snack.error(`Failed to sync with TravCom: ${error}`)
  } finally {
    isLoading.value = false
  }
}
</script>
