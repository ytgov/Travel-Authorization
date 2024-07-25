<template>
  <v-dialog
    v-model="showDialog"
    width="500"
    @keydown.esc="close"
  >
    <v-form
      ref="form"
      @submit.prevent="updateAndClose"
    >
      <v-card :loading="isLoading">
        <v-card-title class="blue">
          <div class="text-h5">Edit Per Diem</div>
        </v-card-title>

        <v-skeleton-loader
          v-if="isNil(perDiem)"
          type="text"
        />
        <v-card-text v-else>
          <v-row class="mt-5 mx-3">
            <v-col cols="12">
              <v-text-field
                v-model="perDiem.checkIn"
                label="Amount *"
                type="number"
                :rules="[required]"
                outlined
                required
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="isLoading"
            color="grey darken-5"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            :loading="isLoading"
            color="green darken-1"
            type="submit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { ref, nextTick, watch } from "vue"
import { useRoute, useRouter } from "vue2-helpers/vue-router"
import { cloneDeep, isNil } from "lodash"

import { required } from "@/utils/validators"
import { useSnack } from "@/plugins/snack-plugin"
import perDiemsApi from "@/api/per-diems-api"
import usePerDiem from "@/use/use-per-diem"

/**
 * @template [T=any]
 * @typedef {import("vue").Ref<T>} Ref
 */
/** @typedef {import('vuetify/lib/components/VForm').VForm} VForm */

const emit = defineEmits(["saved"])

/** @type {Ref<number | null>} */
const perDiemId = ref(null)
const { perDiem } = usePerDiem(perDiemId.value)

const snack = useSnack()
const router = useRouter()
const route = useRoute()
const showDialog = ref(false)

/** @type {Ref<InstanceType<typeof VForm> | null>} */
const form = ref(null)
const isLoading = ref(false)

watch(
  () => showDialog.value,
  (value) => {
    if (value) {
      if (route.query.showPerDiemEdit === perDiemId.value?.toString()) {
        return
      }

      router.push({ query: { showPerDiemEdit: perDiemId.value } })
    } else {
      router.push({ query: { showPerDiemEdit: undefined } })
    }
  }
)

function show(newPerDiem) {
  perDiemId.value = newPerDiem.id
  perDiem.value = cloneDeep(newPerDiem)
  showDialog.value = true
}

function close() {
  showDialog.value = false
  resetState()
  form.value?.resetValidation()
}

async function updateAndClose() {
  if (!form.value?.validate()) {
    snack("Please fill in all required fields", { color: "error" })
    return
  }

  isLoading.value = true
  try {
    const { perDiem: newPerDiem } = await perDiemsApi.update(perDiemId.value, perDiem.value)
    close()

    await nextTick()
    emit("saved", newPerDiem.id)
    snack("Per diem saved successfully", { color: "success" })
  } catch (error) {
    console.error(error)
    snack("Failed to save per diem", { color: "error" })
  } finally {
    isLoading.value = false
  }
}

function resetState() {
  perDiem.value = null
}

defineExpose({
  show,
})
</script>

<style scoped>
.label {
  font-weight: 600;
  font-size: 10pt !important;
}
</style>
