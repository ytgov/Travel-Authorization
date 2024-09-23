<template>
  <TitleCard class="mt-10 mb-5">
    <template #title>
      <div>Other Transportation Request</div>
    </template>
    <template #body>
      <div class="d-flex justify-end pr-4">
        <TravelDeskOtherTransportationCreateDialog
          class="ml-auto mr-3"
          :travel-desk-travel-request-id="travelDeskTravelRequestId"
          :min-date="minDate"
          :max-date="maxDate"
          @created="refresh"
        />
      </div>
      <v-row class="mb-3 mx-3">
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="travelDeskOtherTransportations"
            hide-default-footer
            class="elevation-1"
          >
            <template #top>
              <TravelDeskOtherTransportationEditDialog
                ref="editDialog"
                :travel-desk-travel-request-id="travelDeskTravelRequestId"
                :min-date="minDate"
                :max-date="maxDate"
                @saved="refresh"
              />
            </template>
            <template #item.date="{ item }">
              {{ formatDate(item.date) }}
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
                <v-btn
                  :loading="isLoading"
                  title="Delete"
                  icon
                  color="red"
                  @click="deleteOtherTransportation(item)"
                  ><v-icon>mdi-close</v-icon></v-btn
                >
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </template>
  </TitleCard>
</template>

<script setup>
import { computed, ref, toRefs, watch } from "vue"
import { DateTime } from "luxon"
import { isNil } from "lodash"
import { useRoute } from "vue2-helpers/vue-router"

import blockedToTrueConfirm from "@/utils/blocked-to-true-confirm"
import travelDeskOtherTransportationsApi from "@/api/travel-desk-other-transportations-api"
import useTravelAuthorization from "@/use/use-travel-authorization"
import useTravelDeskOtherTransportations from "@/use/use-travel-desk-other-transportations"

import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"
import TravelDeskOtherTransportationCreateDialog from "@/components/travel-desk-other-transportations/TravelDeskOtherTransportationCreateDialog.vue"
import TravelDeskOtherTransportationEditDialog from "@/components/travel-desk-other-transportations/TravelDeskOtherTransportationEditDialog.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const headers = ref([
  {
    text: "Type",
    value: "transportationType",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  { text: "Depart Location", value: "depart", class: "blue-grey lighten-4", sortable: false },
  { text: "Arrive Location", value: "arrive", class: "blue-grey lighten-4", sortable: false },
  { text: "Date", value: "date", class: "blue-grey lighten-4" },
  {
    text: "Additional Information",
    value: "additionalNotes",
    class: "blue-grey lighten-4",
    sortable: false,
  },
  {
    text: "",
    value: "actions",
    class: "blue-grey lighten-4",
    width: "4rem",
    sortable: false,
  },
])

const route = useRoute()

const travelDeskOtherTransportationsQuery = computed(() => ({
  where: {
    travelRequestId: props.travelDeskTravelRequestId,
  },
}))
const { travelDeskOtherTransportations, isLoading, refresh } = useTravelDeskOtherTransportations(
  travelDeskOtherTransportationsQuery
)

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const minDate = computed(() => travelAuthorization.value?.startDate?.slice(0, 10))
const maxDate = computed(() => travelAuthorization.value?.endDate?.slice(0, 10))

/** @type {import("vue").Ref<InstanceType<typeof TravelDeskOtherTransportationEditDialog> | null>} */
const editDialog = ref(null)

function formatDate(date) {
  return DateTime.fromISO(date, { zone: "utc" }).toFormat("MMM dd yyyy")
}

function showEditDialog(otherTransportation) {
  editDialog.value?.show(otherTransportation)
}

function showEditDialogForRouteQuery() {
  const otherTransportationId = parseInt(route.query.showOtherTransportationEdit)
  if (isNaN(otherTransportationId)) return

  const otherTransportation = travelDeskOtherTransportations.value.find(
    (otherTransportation) => otherTransportation.id === otherTransportationId
  )
  if (isNil(otherTransportation)) return

  showEditDialog(otherTransportation)
}

watch(
  () => travelDeskOtherTransportations.value,
  (otherTransportations) => {
    if (otherTransportations.length === 0) return

    showEditDialogForRouteQuery()
  }
)

async function deleteOtherTransportation(otherTransportation) {
  if (!blockedToTrueConfirm("Are you sure you want to remove this transportation request?")) return

  try {
    await travelDeskOtherTransportationsApi.delete(otherTransportation.id)
    await refresh()
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped></style>
