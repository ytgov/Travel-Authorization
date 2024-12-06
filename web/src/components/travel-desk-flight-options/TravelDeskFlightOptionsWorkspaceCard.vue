<template>
  <v-card>
    <v-card-title>
      <h4>Flight Options Groupings</h4>
    </v-card-title>

    <v-data-iterator
      :items="travelDeskFlightOptions"
      :server-items-length="totalCount"
      :items-per-page="-1"
      :loading="isLoading"
      hide-default-footer
    >
      <template #default="{ items }">
        <v-card
          v-for="(item, index) in items"
          :key="`travel-desk-flight-option-${item.id}`"
        >
          <v-card-title>
            <h5>Group {{ index + 1 }}</h5>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <TravelDeskFlightRequestSelect
                  v-model="item.flightRequestId"
                  label="Leg *"
                  :where="{
                    travelRequestId: travelDeskTravelRequestId,
                  }"
                  :rules="[required]"
                  outlined
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="2"
              >
                <v-text-field
                  v-model="item.cost"
                  label="Cost *"
                  type="number"
                  :rules="[required]"
                  prefix="$"
                  outlined
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <v-text-field
                  v-model="item.duration"
                  label="Travel Duration"
                  readonly
                  outlined
                  append-icon="mdi-lock"
                />
              </v-col>
              <v-col
                cols="12"
                md="1"
                class="d-flex justify-center align-baseline"
              >
                <v-btn
                  color="primary"
                  :loading="isSaving"
                  @click="saveTravelDeskFlightOption(item.id, item)"
                  >Save</v-btn
                >
              </v-col>
            </v-row>
            <TravelDeskFlightSegmentsDraggable :travel-desk-flight-option-id="item.id" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              :loading="isSaving"
              @click="deleteTravelDeskFlightOption(item.id)"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-data-iterator>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue"

import { required } from "@/utils/validators"
import blockedToTrueConfirm from "@/utils/blocked-to-true-confirm"

import travelDeskFlightOptionsApi from "@/api/travel-desk-flight-options-api"

import useSnack from "@/use/use-snack"
import useTravelDeskFlightOptions from "@/use/use-travel-desk-flight-options"

import TravelDeskFlightRequestSelect from "@/components/travel-desk-flight-requests/TravelDeskFlightRequestSelect.vue"
import TravelDeskFlightSegmentsDraggable from "@/components/travel-desk-flight-segments/TravelDeskFlightSegmentsDraggable.vue"

const props = defineProps({
  travelDeskTravelRequestId: {
    type: Number,
    required: true,
  },
})

const travelDeskFlightOptionsQuery = computed(() => ({
  filters: {
    forTravelRequest: props.travelDeskTravelRequestId,
  },
}))
const { travelDeskFlightOptions, totalCount, isLoading, refresh } = useTravelDeskFlightOptions(
  travelDeskFlightOptionsQuery
)

const isSaving = ref(false)
const snack = useSnack()

async function saveTravelDeskFlightOption(id, attributes) {
  isSaving.value = true
  try {
    await travelDeskFlightOptionsApi.update(id, attributes)
    await refresh()
    snack.success("Flight option saved.")
  } catch (error) {
    console.error("Failed to save travel desk flight option:", error)
    snack.error(`Failed to save travel desk flight option: ${error}`)
  } finally {
    isSaving.value = false
  }
}

const isDeleting = ref(false)

async function deleteTravelDeskFlightOption(id) {
  if (!blockedToTrueConfirm("Are you sure you want to remove this flight option?")) return

  isDeleting.value = true
  try {
    await travelDeskFlightOptionsApi.delete(id)
    await refresh()
    snack.success("Flight option deleted.")
  } catch (error) {
    console.error("Failed to delete travel desk flight option:", error)
    snack.error(`Failed to delete travel desk flight option: ${error}`)
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped></style>
