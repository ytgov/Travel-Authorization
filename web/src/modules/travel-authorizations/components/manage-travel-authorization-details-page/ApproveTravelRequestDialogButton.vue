<template>
  <v-dialog
    v-model="showDialog"
    width="500"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        :loading="isLoading"
        :disabled="isDisabled"
        :class="buttonClasses"
        color="success"
        v-bind="attrs"
        v-on="on"
      >
        Approve
      </v-btn>
    </template>

    <v-form
      ref="form"
      @submit.prevent="denyAndClose"
    >
      <v-card>
        <v-card-title class="text-h5"> Approve Request </v-card-title>

        <v-card-text :loading="isLoading">
          <p>
            Approve travel of {{ requestorDisplayName }} to
            <v-progress-circular
              v-if="isLoadingLocation"
              indeterminate
              size="10"
              width="1"
              class="mx-2"
            /><span v-else>{{ locationName }}</span
            >?
          </p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="isLoading"
            color="secondary"
            @click="close"
            >Cancel</v-btn
          >
          <v-btn
            :loading="isLoading"
            color="success"
            type="submit"
            >Approve</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { computed, ref, nextTick, watch } from "vue"
import { useRoute, useRouter } from "vue2-helpers/vue-router"

import { useSnack } from "@/plugins/snack-plugin"
import { useTravelAuthorization } from "@/use/travel-authorization"
import { useLocation } from "@/use/use-location"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  requestorDisplayName: {
    type: String,
    required: true,
  },
  travelLocationId: {
    type: Number,
    default: null,
  },
  buttonClasses: {
    type: [String, Array, Object],
    default: null,
  },
})

const emit = defineEmits(["approved"])

const route = useRoute()
const router = useRouter()
const snack = useSnack()
const { isLoading, approve } = useTravelAuthorization(props.travelAuthorizationId)
const { location, isLoading: isLoadingLocation } = useLocation(props.travelLocationId)

const locationName = computed(() => {
  const { city, province } = location.value
  return `${city} (${province})`
})

const form = ref(null)
const showDialog = ref(route.query.showApprove === "true")

function close() {
  showDialog.value = false
  form.value.resetValidation()
}

async function denyAndClose() {
  try {
    await approve()
    close()
    snack("Travel authorization approved!", { color: "success" })
    nextTick(() => {
      emit("approved")
    })
  } catch (error) {
    snack(error.message, { color: "error" })
  }
}

watch(
  () => showDialog.value,
  (newShowDialog) => {
    if (newShowDialog) {
      router.push({ query: { showApprove: newShowDialog } })
    } else {
      router.push({ query: { showApprove: undefined } })
    }
  }
)
</script>
