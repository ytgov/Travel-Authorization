<template>
  <v-data-table
    :headers="headers"
    :items="generalLedgerCodings"
    :items-per-page="10"
    :loading="isLoading"
    class="elevation-2"
  >
    <template #item.amount="{ value }">
      {{ formatCurrency(value) }}
    </template>
    <template #foot>
      <tfoot>
        <tr>
          <td :class="totalRowClasses">Total</td>
          <td :class="totalRowClasses">{{ formatCurrency(totalAmount) }}</td>
        </tr>
      </tfoot>
    </template>
  </v-data-table>
</template>

<script setup>
import { sumBy } from "lodash"
import { computed, watch, ref } from "vue"

import useGeneralLedgerCodings from "@/use/general-ledger-codings"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { generalLedgerCodings, isLoading, fetch } = useGeneralLedgerCodings()
const totalAmount = computed(() => sumBy(generalLedgerCodings.value, "amount"))

const headers = ref([
  { text: "Vote/Program/Object/Sub1/Sub2", value: "code" },
  { text: "Amount", value: "amount" },
])
const totalRowClasses = ref("text-start font-weight-bold text-uppercase")

watch(
  () => props.travelAuthorizationId,
  async (newTravelAuthorizationId) => {
    await await fetch({
      where: {
        travelAuthorizationId: newTravelAuthorizationId,
      },
    })
  },
  { immediate: true }
)

function formatCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  })
  return formatter.format(amount)
}
</script>
