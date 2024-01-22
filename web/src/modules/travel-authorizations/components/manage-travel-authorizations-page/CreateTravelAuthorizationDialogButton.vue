<template>
  <v-dialog
    v-model="showDialog"
    width="500"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        :disabled="isLoading"
        :loading="isLoading"
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        Create Travel Request
      </v-btn>
    </template>

    <v-form
      ref="form"
      @submit.prevent="createAndGoToFormDetails"
    >
      <v-card>
        <v-card-title class="text-h5"> Create Travel Request </v-card-title>

        <v-card-text :loading="isLoading">
          <p>Create travel request for:</p>

          <SearchableUserEmailCombobox
            v-model="userEmail"
            outlined
            required
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="isLoading"
            color="secondary"
            @click="close"
            >Cancel</v-btn
          >
          <v-btn
            :loading="isLoading"
            color="success"
            type="submit"
            >Create</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue2-helpers/vue-router"

import SearchableUserEmailCombobox from "@/components/SearchableUserEmailCombobox"

import { useSnack } from "@/plugins/snack-plugin"
import { ACCOMMODATION_TYPES, TRAVEL_METHODS } from "@/api/stops-api"
import { useTravelAuthorization } from "@/use/travel-authorization"

const snack = useSnack()
const route = useRoute()
const router = useRouter()
const { create, isLoading } = useTravelAuthorization()

const form = ref(null)
const showDialog = ref(route.query.showApprove === "true")
const userEmail = ref(null)

function goToFormDetails(travelAuthorizationId) {
  this.$router.push({
    name: "EditMyTravelAuthorizationDetailsPage",
    params: { travelAuthorizationId },
  })
}

async function createAndGoToFormDetails() {
  try {
    const { travelAuthorization } = await create({
      // userId: currentUserId,
      stopsAttributes: [
        {
          accommodationType: ACCOMMODATION_TYPES.HOTEL,
          transport: TRAVEL_METHODS.AIRCRAFT,
        },
        {
          transport: TRAVEL_METHODS.AIRCRAFT,
          accommodationType: null,
        },
      ],
    })
    snack("Travel authorization created.", { color: "success" })
    close()
    return goToFormDetails(travelAuthorization.id)
  } catch (error) {
    snack(error.message, { color: "error" })
  }
}

function close() {
  showDialog.value = false
  form.value.resetValidation()
}

watch(
  () => showDialog.value,
  (newShowDialog) => {
    if (newShowDialog) {
      router.push({ query: { showApprove: newShowDialog } })
    } else {
      router.push({ query: { showApprove: undefined } })
    }
  }
)

watch(
  () => userEmail.value,
  (value) => {
    console.log("value:", value)
  }
)
</script>
