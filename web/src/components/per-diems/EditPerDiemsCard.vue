<template>
  <v-card>
    <v-card-title>
      <h3>Per-Diems</h3>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="perDiems"
      :loading="isLoading"
    >
      <template #top>
        <!-- <EditPerDiemsDialog
          ref="editDialog"
          @saved="refresh"
        /> -->
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex justify-end">
          <v-btn
            title="Edit"
            icon
            color="blue"
            @click="showEditDialog(item)"
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue"

import usePerDiems from "@/use/use-per-diems"

const headers = ref([
  {
    text: "",
    value: "claimType",
  },
  {
    text: "Yukon/Alaska",
    value: "yukon/alaska",
  },
  {
    text: "NWT",
    value: "nwt",
  },
  {
    text: "Nunavut",
    value: "nunavut",
  },
  {
    text: "Rest of Canada",
    value: "restOfCanada",
  },
  {
    text: "Rest of USA",
    value: "restOfUsa",
  },
  {
    text: "",
    value: "actions",
  },
])

const perDiemsQuery = computed(() => ({}))
const { perDiems, isLoading } = usePerDiems(perDiemsQuery)

/** @type {import("vue").Ref<InstanceType<typeof EditPerDiemDialog> | null>} */
const editDialog = ref(null)

function showEditDialog(flightRequest) {
  editDialog.value?.show(flightRequest)
}
</script>

<style scoped></style>
