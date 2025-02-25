<template>
  <v-dialog
    v-model="showDialog"
    max-width="400px"
    @keydown.esc="hide"
  >
    <template #activator="slotData">
      <slot
        name="activator"
        v-bind="slotData"
      >
        <v-btn
          color="primary"
          v-bind="merge({}, slotData.attrs, activatorProps)"
          v-on="slotData.on"
        >
          Reconcile
        </v-btn>
      </slot>
    </template>

    <v-form
      ref="form"
      @submit.prevent="createAndHide"
    >
      <v-card :loading="isLoading">
        <v-card-title>
          <h2>Reconcile Flights</h2>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="flightReconciliationAttributes.reconcilePeriod"
                label="What Period? *"
                :items="periodOptions"
                :rules="[required]"
                outlined
                required
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :loading="isLoading"
            color="warning"
            outlined
            @click="hide"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            :loading="isLoading"
            color="primary"
            type="submit"
          >
            Reconcile
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { ref, nextTick, watch } from "vue"
import { cloneDeep, isEmpty, merge, range } from "lodash"

import { required } from "@/utils/validators"

import flightReconciliationsApi from "@/api/flight-reconciliations-api"

import useRouteQuery, { booleanTransformer } from "@/use/utils/use-route-query"
import useSnack from "@/use/use-snack"

const props = defineProps({
  selectedFlightReconciliations: {
    type: Array,
    required: true,
  },
  activatorProps: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(["created"])

const flightReconciliationAttributes = ref({
  period: null,
})

const periodOptions = ref(range(1, 13).concat(14)) // [1-12, 14]

const showDialog = useRouteQuery(
  "showFlightReconciliationsBulkEdit",
  !isEmpty(props.selectedFlightReconciliations),
  {
    transform: booleanTransformer,
  }
)

watch(
  () => cloneDeep(props.selectedFlightReconciliations),
  (newSelectedFlights) => {
    if (isEmpty(newSelectedFlights)) {
      showDialog.value = false
    }

    resetAttributes()
  },
  {
    immediate: true,
    deep: true,
  }
)

/** @type {import("vue").Ref<InstanceType<typeof import("vuetify/lib").VForm> | null>} */
const form = ref(null)
const isLoading = ref(false)

const snack = useSnack()

async function createAndHide() {
  if (!form.value?.validate()) {
    snack.error("Please fill in all required fields")
    return
  }

  isLoading.value = true
  try {
    const updatedFlightReconciliationIds = []
    for (const flightReconciliation of props.selectedFlightReconciliations) {
      const attributes = {
        reconciled: true,
        ...flightReconciliationAttributes.value,
      }
      const { flightReconciliation: updatedFlightReconciliation } =
        await flightReconciliationsApi.update(flightReconciliation.id, attributes)
      updatedFlightReconciliationIds.push(updatedFlightReconciliation.id)
    }
    hide()

    await nextTick()
    emit("created", updatedFlightReconciliationIds)
    snack.success("Flights reconciled successfully")
  } catch (error) {
    snack.error("Failed to reconcile flights")
  } finally {
    isLoading.value = false
  }
}

function hide() {
  showDialog.value = false
  resetAttributes()
  form.value?.resetValidation()
}

function resetAttributes() {
  flightReconciliationAttributes.value = cloneDeep(props.selectedFlightReconciliations)
}
</script>

<style scoped>
.gap-4 {
  gap: 1rem; /* 16px */
}
</style>
