<template>
  <v-card>
    <v-card-title><h3>Details</h3></v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <DescriptionElement
            :value="
              t(`travel_authorization.trip_type.${travelAuthorization.tripType}`, {
                $default: travelAuthorization.tripType,
              })
            "
            label="Trip Type"
          />
        </v-col>
      </v-row>

      <component
        :is="tripTypeComponent"
        v-if="tripTypeComponent"
        :travel-authorization-id="travelAuthorizationId"
        class="mt-3"
      />
      <div v-else>Trip type {{ travelAuthorization.tripType }} not implemented!</div>
      <v-row>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelAuthorization.travelDuration"
            label="# Days"
            dense
            outlined
            readonly
            append-icon="mdi-lock"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            :value="travelAuthorization.daysOffTravelStatus"
            label="Days on non-travel status"
            dense
            outlined
            readonly
            append-icon="mdi-lock"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            :value="travelAuthorization.dateBackToWork"
            label="Expected Date return to work"
            prepend-icon="mdi-calendar"
            dense
            outlined
            readonly
            append-icon="mdi-lock"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, toRefs } from "vue"

import { useI18n } from "@/plugins/vue-i18n-plugin"
import useTravelAuthorization, { TRIP_TYPES } from "@/use/use-travel-authorization"

import DescriptionElement from "@/components/common/DescriptionElement.vue"

const props = defineProps({
  travelAuthorizationId: {
    type: Number,
    required: true,
  },
})

const { t } = useI18n()

const { travelAuthorizationId } = toRefs(props)
const { travelAuthorization } = useTravelAuthorization(travelAuthorizationId)

const tripTypeComponent = computed(() => {
  switch (travelAuthorization.value.tripType) {
    case TRIP_TYPES.ROUND_TRIP:
      return () =>
        import("@/components/travel-authorizations/details-card/RoundTripStopsSection.vue")
    case TRIP_TYPES.ONE_WAY:
      return () => import("@/components/travel-authorizations/details-card/OneWayStopsSection.vue")
    case TRIP_TYPES.MULTI_CITY:
      return () =>
        import("@/components/travel-authorizations/details-card/MultiDestinationStopsSection.vue")
    default:
      return null
  }
})
</script>
