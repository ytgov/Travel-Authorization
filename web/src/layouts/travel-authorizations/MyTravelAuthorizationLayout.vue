<template>
  <div class="d-flex flex-column flex-md-row">
    <TravelAuthorizationStateStepper
      ref="travelAuthorizationStateStepper"
      :travel-authorization-id="travelAuthorizationIdAsNumber"
    />
    <div class="ml-2">
      <div class="d-flex justify-space-between align-baseline my-5">
        <h2 class="mb-0">
          Travel -
          <VUserChipMenu :user-id="currentUser.id" />
        </h2>
      </div>

      <v-card class="default">
        <v-card-text>
          <SummaryHeaderPanel
            :travel-authorization-id="travelAuthorizationIdAsNumber"
            class="mt-5"
          />

          <router-view @state-changed="refresh"></router-view>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"

import useCurrentUser from "@/use/use-current-user"

import VUserChipMenu from "@/components/VUserChipMenu.vue"
import TravelAuthorizationStateStepper from "@/components/travel-authorizations/TravelAuthorizationStateStepper.vue"
import SummaryHeaderPanel from "@/components/travel-authorizations/SummaryHeaderPanel.vue"

/**
 * @template [T=any]
 * @typedef {import("vue").Ref<T>} Ref
 */

const props = defineProps({
  travelAuthorizationId: {
    type: [String, Number],
    required: true,
  },
})

const travelAuthorizationIdAsNumber = computed(() => parseInt(props.travelAuthorizationId))

const { currentUser } = useCurrentUser()

/** @type {Ref<InstanceType<typeof EditPerDiemDialog> | null>} */

/** @type {import("vue").Ref<InstanceType<typeof TravelAuthorizationStateStepper> | null>} */
const travelAuthorizationStateStepper = ref(null)

async function refresh() {
  await travelAuthorizationStateStepper.value?.refresh()
}
</script>
