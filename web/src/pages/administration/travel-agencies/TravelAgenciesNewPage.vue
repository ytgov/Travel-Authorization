<template>
  <v-container class="pa-0 py-md-3 px-md-6">
    <v-form
      ref="form"
      @submit.prevent="createTravelAgency"
    >
      <v-card>
        <v-card-title>
          <h2>Create Travel Agency</h2>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="attributes.agencyName"
                label="Agency Name *"
                outlined
                required
                :rules="[required]"
              />
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-textarea
                v-model="attributes.agencyInfo"
                label="Paste Travel Agency Information Here"
                clearable
                outlined
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="isLoading"
            color="warning"
            outlined
            @click="goToTravelAgenciesPage"
          >
            Cancel
          </v-btn>

          <v-btn
            :loading="isLoading"
            class="ml-4"
            color="success"
            type="submit"
            >Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue2-helpers/vue-router"

import { useSnack } from "@/plugins/snack-plugin"
import { required } from "@/utils/validators"
import travelDeskTravelAgenciesApi from "@/api/travel-desk-travel-agencies-api"
import useBreadcrumbs from "@/use/use-breadcrumbs"

/**
 * @template [T=any]
 * @typedef {import("vue").Ref<T>} Ref
 */
/** @typedef {import('vuetify/lib').VForm} VForm */

const isLoading = ref(false)

/** @type {Ref<InstanceType<typeof VForm> | null>} */
const form = ref(null)

const attributes = ref({
  agencyName: "",
  agencyInfo: null,
})
const router = useRouter()

const snack = useSnack()

async function createTravelAgency() {
  if (!form.value?.validate()) {
    snack("Please fill in all required fields.", { color: "error" })
    return
  }

  isLoading.value = true
  try {
    await travelDeskTravelAgenciesApi.create(attributes.value)
    return goToTravelAgenciesPage()
  } catch (error) {
    console.error(error)
    snack(`Failed to create travel agency: ${error}`, { color: "error" })
  } finally {
    isLoading.value = false
  }
}

function goToTravelAgenciesPage() {
  return router.push({
    name: "administration/TravelAgenciesPage",
  })
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
  {
    text: "New Travel Agency",
    to: { name: "administration/travel-agencies/TravelAgenciesNewPage" },
  },
])
</script>

<style scoped></style>
