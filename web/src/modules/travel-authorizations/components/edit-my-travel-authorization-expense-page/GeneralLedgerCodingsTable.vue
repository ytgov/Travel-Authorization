<template>
  <v-data-table
    :headers="headers"
    :items="generalLedgerCodings"
    :items-per-page="10"
    :loading="isLoading"
    class="elevation-2"
  >
    <template #top>
      <!-- TODO -->
      <ExpenseEditDialog
        ref="editDialog"
        @saved="refresh"
      />
      <ExpenseDeleteDialog
        ref="deleteDialog"
        @deleted="refresh"
      />
    </template>
    <template #item.amount="{ value }">
      {{ formatCurrency(value) }}
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex justify-end">
        <v-btn
          color="secondary"
          @click="showEditDialog(item)"
          >Edit</v-btn
        >
        <v-btn
          icon
          class="ml-2"
          color="error"
          @click="showDeleteDialog(item)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </template>
    <template #foot>
      <tfoot>
        <tr>
          <td :class="totalRowClasses">Total</td>
          <td :class="totalRowClasses">{{ formatCurrency(totalAmount) }}</td>
          <td :class="totalRowClasses"></td>
        </tr>
      </tfoot>
    </template>
  </v-data-table>
</template>

<script setup>
import { sumBy } from "lodash"
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue2-helpers/vue-router"

import useGeneralLedgerCodings from "@/use/general-ledger-codings"

import ExpenseDeleteDialog from "./ExpenseDeleteDialog"
import ExpenseEditDialog from "./ExpenseEditDialog"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const route = useRoute()
const { generalLedgerCodings, isLoading, fetch } = useGeneralLedgerCodings()
const totalAmount = computed(() => sumBy(generalLedgerCodings.value, "amount"))

const headers = ref([
  { text: "Vote/Program/Object/Sub1/Sub2", value: "code" },
  { text: "Amount", value: "amount" },
  { text: "", value: "actions" },
])
const totalRowClasses = ref("text-start font-weight-bold text-uppercase")

onMounted(async () => {
  await refresh()
  showEditDialogForRouteQuery()
  showDeleteDialogForRouteQuery()
})

function formatCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  })
  return formatter.format(amount)
}

async function refresh() {
  await fetch({
    where: {
      travelAuthorizationId: props.travelAuthorizationId,
    },
  })
}

function showDeleteDialog(item) {
  this.$refs.deleteDialog.show(item)
}

function showEditDialog(item) {
  this.$refs.editDialog.show(item)
}

function showEditDialogForRouteQuery() {
  const generalLedgerCodingId = parseInt(route.query.showEdit)
  if (isNaN(generalLedgerCodingId)) return

  const generalLedgerCoding = generalLedgerCodings.value.find(
    (generalLedgerCoding) => generalLedgerCoding.id === generalLedgerCodingId
  )
  if (!generalLedgerCoding) return

  showEditDialog(generalLedgerCoding)
}

function showDeleteDialogForRouteQuery() {
  const generalLedgerCodingId = parseInt(route.query.showDelete)
  if (isNaN(generalLedgerCodingId)) return

  const generalLedgerCoding = generalLedgerCodings.value.find(
    (generalLedgerCoding) => generalLedgerCoding.id === generalLedgerCodingId
  )
  if (!generalLedgerCoding) return

  showDeleteDialog(generalLedgerCoding)
}
</script>
