<template>
  <div>
    <v-btn
      v-if="hasEstimates"
      :loading="isLoading"
      class="mt-0"
      color="primary"
      @click="submitAndRedirect"
    >
      Submit to Supervisor
    </v-btn>
    <v-tooltip
      v-else
      bottom
    >
      <template #activator="{ on, attrs }">
        <span
          v-bind="attrs"
          v-on="on"
        >
          <v-btn
            class="mt-0"
            color="secondary"
            disabled
            >Submit to Supervisor
            <v-icon
              class="ml-1"
              small
            >
              mdi-help-circle-outline
            </v-icon>
          </v-btn>
        </span>
      </template>
      <span>You need to generate an estimate before submitting.</span>
    </v-tooltip>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRouter } from "vue2-helpers/vue-router"

import { useSnack } from "@/plugins/snack-plugin"

import useTravelAuthorization from "@/use/travel-authorization"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
  validate: {
    type: Function,
    required: true,
  },
  estimates: {
    type: Array,
    default: () => [],
  },
})

const router = useRouter()
const snack = useSnack()
const { isLoading, submit } = useTravelAuthorization(props.travelAuthorizationId)

const hasEstimates = computed(() => props.estimates.length > 0)

async function submitAndRedirect() {
  if (!props.validate()) {
    snack("Form submission can't be sent until the form is complete.", { color: "error" })
    return
  }

  try {
    await submit()
    router.push({
      name: "ReadMyTravelAuthorizationDetailsPage",
      params: { travelAuthorizationId: props.travelAuthorizationId },
    })
  } catch (error) {
    snack(error.message, { color: "error" })
  }
}
</script>
