<template>
  <v-card class="card--outlined">
    <v-card-title>
      <h4>Options</h4>
    </v-card-title>
    <v-card-text>
      <v-card class="card--outlined">
        <v-card-title>
          <h5>Leg 1</h5>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <FlightPreferenceOrderSelect />
            </v-col>

            <v-col
              cols="12"
              md="10"
            >
              <dl>
                <DescriptionElement
                  class="d-flex"
                  label="Cost"
                  value="$498.17"
                  horizontal
                />
                <DescriptionElement
                  label="Airline"
                  value="Air North 4N511"
                  horizontal
                />
                <DescriptionElement
                  label="Departure"
                  value="12 Mar 07:30 Whitehorse (YXY) Terminal: M"
                  horizontal
                />
                <DescriptionElement
                  label="Arrival"
                  value="12 Mar 09:45 Vancouver (YVR) Terminal: M"
                  horizontal
                />
                <DescriptionElement
                  label="Duration"
                  value="2h 15m"
                  horizontal
                />
              </dl>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Air Canada AC14</v-list-item-title>
                    <v-list-item-subtitle>
                      Departure: 12 Mar 11:25 Vancouver (YVR) Terminal: M<br />
                      Arrival: 12 Mar 18:50 Toronto (YYZ) Terminal: 1<br />
                      Duration: 4h 25m
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <FlightPreferenceOrderSelect />
            </v-col>

            <v-col
              cols="12"
              md="10"
            >
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Air Canada AC8102 - Operated by Jazz</v-list-item-title>
                    <v-list-item-subtitle>
                      Departure: 12 Mar 10:00 Whitehorse (YXY) Terminal: M<br />
                      Arrival: 12 Mar 12:20 Vancouver (YVR) Terminal: M<br />
                      Duration: 2h 20m
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Air Canada AC126</v-list-item-title>
                    <v-list-item-subtitle>
                      Departure: 12 Mar 22:00 Vancouver (YVR) Terminal: M<br />
                      Arrival: 13 Mar 05:34 Toronto (YYZ) Terminal: 1<br />
                      Duration: 4h 34m
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Another Leg group -->
      <v-card
        outlined
        class="mb-4"
      >
        <v-card-title> Leg 2 </v-card-title>
        <v-card-subtitle> COST: $498.17 </v-card-subtitle>

        <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <v-row align="center">
              <v-col>
                <strong>Preference</strong>
              </v-col>
              <v-col>
                <v-radio-group v-model="selectedPreference2">
                  <v-radio
                    label="Pref1"
                    value="pref1"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Air Canada AC116</v-list-item-title>
                  <v-list-item-subtitle>
                    Departure: 19 Mar 11:45 Toronto (YYZ) Terminal: 1<br />
                    Arrival: 19 Mar 12:10 Vancouver (YVR) Terminal: M<br />
                    Duration: 4h 25m
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Air North 4N513</v-list-item-title>
                  <v-list-item-subtitle>
                    Departure: 20 Mar 10:30 Vancouver (YVR) Terminal: <br />
                    Arrival: 20 Mar 12:45 Whitehorse (YXY) Terminal: M<br />
                    Duration: 2h 15m
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FlightPreferenceOrderSelect from "@/components/travel-desk-flight-options/FlightPreferenceOrderSelect.vue"
import DescriptionElement from "@/components/common/DescriptionElement.vue"

defineProps({
  travelDeskFlightRequestId: {
    type: Number,
    required: true,
  },
})
</script>
