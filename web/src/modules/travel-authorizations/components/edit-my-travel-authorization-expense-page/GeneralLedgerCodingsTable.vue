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
    <template #item.actions="{ value: actions, item }">
      <!-- TODO -->
      <div class="d-flex">
        <v-col class="d-flex justify-end">
          <v-btn
            v-if="actions.includes('edit')"
            color="secondary"
            @click="showEditDialog(item)"
            >Edit</v-btn
          >
        </v-col>
        <v-col class="d-flex justify-end">
          <AddReceiptButton
            v-if="item.fileSize === null"
            :expense-id="item.id"
            @uploaded="refresh"
          />
          <ViewRecieptLink
            v-else
            :expense-id="item.id"
          />

          <v-btn
            v-if="actions.includes('delete')"
            icon
            class="ml-2"
            color="error"
            @click="showDeleteDialog(item)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
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
import { useRoute } from "vue-router"

import useGeneralLedgerCodings from "@/use/general-ledger-codings"

import AddReceiptButton from "./AddReceiptButton"
import ExpenseDeleteDialog from "./ExpenseDeleteDialog"
import ExpenseEditDialog from "./ExpenseEditDialog"
import ViewRecieptLink from "./ViewRecieptLink"

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
