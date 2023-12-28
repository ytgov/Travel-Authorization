<template>
  <v-dialog
    v-model="showDialog"
    max-width="500px"
  >
    <v-form
      ref="form"
      @submit.prevent="updateAndClose"
    >
      <v-card :loading="isLoading">
        <v-card-title>
          <span class="text-h5">Edit Coding</span>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <!--
                See https://www.tpsgc-pwgsc.gc.ca/recgen/pceaf-gwcoa/2223/2-eng.html
                Department/Agency, Financial Reporting Account (FRA), Authority, Program, Object, Transaction Type
              -->
              <v-text-field
                v-model="generalLedgerCoding.code"
                :rules="[required]"
                label="Vote/Program/Object/Sub1/Sub2"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <CurrencyTextField
                v-model="generalLedgerCoding.amount"
                :rules="[required]"
                label="Amount"
                required
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="isLoading"
            color="error"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            :loading="isLoading"
            type="submit"
            color="primary"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { computed, nextTick, watch, ref } from "vue"
import { cloneDeep } from "lodash"
import { useRoute, useRouter } from "vue2-helpers/vue-router"

import { useSnack } from "@/plugins/snack-plugin"

import generalLedgerCodingsApi from "@/api/general-ledger-codings-api"
import { required } from "@/utils/validators"
import CurrencyTextField from "@/components/Utils/CurrencyTextField"

const emit = defineEmits(["saved"])

defineExpose({
  show,
})

const route = useRoute()
const router = useRouter()
const snack = useSnack()

const generalLedgerCoding = ref({})
const showDialog = ref(false)
const isLoading = ref(false)
const form = ref(null)

const generalLedgerCodingId = computed(() => generalLedgerCoding.value.id)

watch(
  () => showDialog.value,
  (value) => {
    if (value) {
      if (route.query.showEdit === generalLedgerCodingId.value.toString()) return

      router.push({ query: { showEdit: generalLedgerCodingId.value } })
    } else {
      router.push({ query: { showEdit: undefined } })
    }
  }
)

function show(newGeneralLedgerCoding) {
  generalLedgerCoding.value = cloneDeep(newGeneralLedgerCoding)
  showDialog.value = true
}

function close() {
  showDialog.value = false
  nextTick(() => {
    generalLedgerCoding.value = {}
    form.value.resetValidation()
  })
}

async function updateAndClose() {
  isLoading.value = true
  try {
    await generalLedgerCodingsApi.update(generalLedgerCodingId.value, generalLedgerCoding.value)

    close()

    nextTick(() => {
      emit("saved")
    })
  } catch (error) {
    snack(error.message, { color: "error" })
  } finally {
    isLoading.value = false
  }
}
</script>
