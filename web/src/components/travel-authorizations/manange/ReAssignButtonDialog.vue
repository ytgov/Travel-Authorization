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
        color="warning"
        v-bind="attrs"
        v-on="on"
      >
        Re-assign
      </v-btn>
    </template>

    <v-form
      ref="form"
      @submit.prevent="reAssignAndClose"
    >
      <v-card>
        <v-card-title class="text-h5"> Re-assign Request </v-card-title>

        <v-card-text :loading="isLoading">
          <p>Note for the next approver</p>
          <v-row>
            <v-col>
              <v-textarea
                v-model="note"
                :rules="[required]"
                label="Note"
                rows="5"
                required
                outlined
              />
            </v-col>
          </v-row>
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
            color="error"
            type="submit"
            >Re-assign</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { ref, nextTick } from "vue"

import { required } from "@/utils/validators"

import { useSnack } from "@/plugins/snack-plugin"
import travelAuthorizationApi from "@/api/travel-authorizations-api"
import useRouteQuery from "@/use/use-route-query"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  buttonClasses: {
    type: [String, Array, Object],
    default: null,
  },
})

const emit = defineEmits(["re-assigned"])

const snack = useSnack()
console.log("snack:", snack)
const isLoading = ref(false)
const form = ref(null)
const showDialog = useRouteQuery("showReAssign", false)
const note = ref(null)

function close() {
  showDialog.value = false
  form.value.resetValidation()
}

async function reAssignAndClose() {
  isLoading.value = true
  try {
    await travelAuthorizationApi.reAssign({
      note: note.value,
    })
    close()
    snack.success("Travel authorization denied.")
    nextTick(() => {
      emit("denied")
    })
  } catch (error) {
    snack.error(error.message)
  } finally {
    isLoading.value = false
  }
}
</script>
