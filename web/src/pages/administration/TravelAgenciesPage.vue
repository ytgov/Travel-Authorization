<template>
  <v-container>
    <h2>Travel Agencies</h2>

    <v-card class="px-5 pb-5">
      <v-row class="mx-0 my-1">
        <NewTravelAgency
          class="mt-4 mr-5 ml-auto"
          type="New"
          :agency-info="agencyAttributes"
          :loading="isSaving"
          @save="createTravelAgency"
        />
      </v-row>
      <v-data-table
        :headers="headers"
        :items="travelAgencies"
        :items-per-page="15"
        :loading="isLoading"
        class="elevation-1 mt-4"
      >
        <template #item.edit="{ item }">
          <v-row class="mx-0">
            <NewTravelAgency
              type="Edit"
              :agency-info="item"
              :loading="isUpdating"
              @save="saveTravelAgency(item.id, item)"
            />
            <v-btn
              :loading="isUpdating"
              style="min-width: 0; padding: 1.115rem 0"
              color="red"
              class="ml-3 px-3"
              small
              @click="deleteTravelAgency(item.id)"
            >
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue"

import travelDeskTravelAgenciesApi from "@/api/travel-desk-travel-agencies-api"
import useBreadcrumbs from "@/use/use-breadcrumbs"

import NewTravelAgency from "@/components/Administration/LookupTableManagement/TravelAgentsComponents/NewTravelAgency.vue"

const headers = ref([
  { text: "Agency Name", value: "agencyName", class: "blue-grey lighten-4" },
  { text: "Agency Info", value: "agencyInfo", class: "blue-grey lighten-4", sortable: false },
  {
    text: "",
    value: "edit",
    class: "blue-grey lighten-4",
    width: "8rem",
    cellClass: "px-0 mx-0",
    sortable: false,
  },
])

const travelAgencies = ref([])
const agencyAttributes = ref({ agencyName: "", agencyInfo: "" })
const isLoading = ref(false)
const isSaving = ref(false)
const isUpdating = ref(false)

onMounted(async () => {
  travelAgencies.value = await loadTravelAgencies()
})

async function loadTravelAgencies() {
  isLoading.value = true
  try {
    const { travelDeskTravelAgencies } = await travelDeskTravelAgenciesApi.list()
    return travelDeskTravelAgencies
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function refreshTravelAgencies() {
  travelAgencies.value = await loadTravelAgencies()
}

async function deleteTravelAgency(id) {
  isUpdating.value = true
  try {
    await travelDeskTravelAgenciesApi.delete(id)
    await refreshTravelAgencies()
  } catch (error) {
    console.error(error)
  } finally {
    isUpdating.value = false
  }
}

async function createTravelAgency(attributes) {
  isSaving.value = true
  try {
    await travelDeskTravelAgenciesApi.create(attributes)
    await refreshTravelAgencies()
  } catch (error) {
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

async function saveTravelAgency(id, attributes) {
  isUpdating.value = true
  try {
    await travelDeskTravelAgenciesApi.update(id, attributes)
    await refreshTravelAgencies()
  } catch (error) {
    console.error(error)
  } finally {
    isUpdating.value = false
  }
}

useBreadcrumbs([
  {
    text: "Administration",
    to: { name: "AdministrationPage" },
  },
  {
    text: "Travel Agencies",
    to: { name: "administration/TravelAgenciesPage" },
  },
])
</script>

<style scoped></style>
