<template>
  <v-container class="pa-0 py-md-3 px-md-6">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <h2>Travel Agencies</h2>
        <v-btn
          color="primary"
          :to="{ name: 'administration/travel-agencies/TravelAgenciesNewPage' }"
          >Add Travel Agency</v-btn
        >
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="travelDeskTravelAgencies"
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
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue"

import travelDeskTravelAgenciesApi from "@/api/travel-desk-travel-agencies-api"
import useTravelDeskTravelAgencies from "@/use/use-travel-desk-travel-agencies"
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

const { travelDeskTravelAgencies, isLoading, refresh } = useTravelDeskTravelAgencies()

const isUpdating = ref(false)

async function deleteTravelAgency(id) {
  isUpdating.value = true
  try {
    await travelDeskTravelAgenciesApi.delete(id)
    await refresh()
  } catch (error) {
    console.error(error)
  } finally {
    isUpdating.value = false
  }
}

async function saveTravelAgency(id, attributes) {
  isUpdating.value = true
  try {
    await travelDeskTravelAgenciesApi.update(id, attributes)
    await refresh()
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
