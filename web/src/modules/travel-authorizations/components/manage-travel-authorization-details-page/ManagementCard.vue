<template>
  <v-card elevation="2">
    <v-card-title> Management</v-card-title>
    <v-card-text>
      <!-- TODO: add support for re-assignment to another supervisor -->
      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn
            :loading="isLoading"
            :disabled="isDisabled"
            color="success"
            @click="approveWrapper"
          >
            Approve
          </v-btn>
          <v-btn
            :loading="isLoading"
            :disabled="isDisabled"
            class="ml-2"
            color="error"
            @click="denyWrapper"
          >
            Deny
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, watch, onMounted } from "vue"

import { useSnack } from "@/plugins/snack-plugin"
import { useTravelAuthorization } from "@/use/travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(["approved", "denied"])

const snack = useSnack()
const { travelAuthorization, isLoading, fetch, approve, deny, STATUSES } = useTravelAuthorization(
  props.travelAuthorizationId
)

const isDisabled = computed(() => {
  return isLoading.value || travelAuthorization.value.status !== STATUSES.SUBMITTED
})

async function approveWrapper() {
  return approve()
    .then(() => {
      snack("Travel authorization approved!", { color: "success" })
      emit("approved")
    })
    .catch((error) => {
      snack(error.message, { color: "error" })
    })
}

async function denyWrapper() {
  return deny()
    .then(() => {
      snack("Travel authorization denied.", { color: "success" })
      emit("denied")
    })
    .catch((error) => {
      snack(error.message, { color: "error" })
    })
}

watch(
  () => props.travelAuthorizationId,
  async () => {
    await fetch(props.travelAuthorizationId)
  },
  { immediate: true }
)

onMounted(async () => {
  if (!isLoading.value) {
    await fetch()
  }
})
</script>
