<template>
  <div>
    <Breadcrumbs />
    <h1>Travel Desk Requests</h1>
    <v-card
      :loading="loadingData"
      :disabled="loadingData"
      class="default"
    >
      <v-card-text>
        <v-alert
          v-if="alertMsg"
          class="mt-5"
          type="info"
          >{{ alertMsg }}</v-alert
        >
        <div
          v-if="loadingData"
          class="mt-10"
          style="text-align: center"
        >
          loading ...
        </div>
        <div v-else>
          <TravelDeskRequests
            :travel-desk-requests="travelDeskRequests"
            @updateTable="getTravelDeskRequests"
          />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { TRAVEL_DESK_URL, USERS_URL, PROFILE_URL } from "@/urls"
import http from "@/api/http-client"
import locationsApi from "@/api/locations-api"

import Breadcrumbs from "@/components/Breadcrumbs.vue"
import TravelDeskRequests from "@/modules/travelDesk/views/Desk/TravelDeskRequests.vue"

export default {
  name: "TravelDesk",
  components: {
    TravelDeskRequests,
    Breadcrumbs,
  },
  data() {
    return {
      tabs: null,
      travelDeskRequests: [],
      loadingData: false,
      department: "",
      alertMsg: "",
    }
  },
  async mounted() {
    this.loadingData = true
    // await this.getUserAuth();
    this.department = this.$store.state.auth.department
    await this.getDestinations()
    await this.getTravelDeskUsers()
    await this.getTravelDeskRequests()
  },
  methods: {
    async getUserAuth() {
      return http
        .get(PROFILE_URL)
        .then((resp) => {
          this.$store.commit("auth/setUser", resp.data.user)
        })
        .catch((e) => {
          console.log(e)
        })
    },

    async getDestinations() {
      this.loadingData = true
      return locationsApi.list().then(({ locations }) => {
        const formattedLocations = locations.map(({ id, city, province }) => {
          return {
            value: id,
            text: `${city} (${province})`,
            city,
            province,
          }
        })
        this.$store.commit("traveldesk/SET_DESTINATIONS", formattedLocations)
        return formattedLocations
      })
    },

    async getTravelDeskUsers() {
      this.loadingData = true
      return http
        .get(`${USERS_URL}/travel-desk-users`)
        .then((resp) => {
          // console.log(resp.data)
          this.$store.commit("traveldesk/SET_TRAVEL_DESK_USERS", resp.data)
        })
        .catch((e) => {
          console.log(e.response)
          this.alertMsg = e.response.data
          this.loadingData = false
        })
    },

    async getTravelDeskRequests() {
      this.loadingData = true
      return http
        .get(`${TRAVEL_DESK_URL}/`)
        .then((resp) => {
          this.travelDeskRequests = resp.data
          // console.log(this.travelDeskRequests)
          this.travelDeskRequests.forEach((travelDeskRequest) => {
            travelDeskRequest.userTravel =
              this.$store.state.auth.fullName == travelDeskRequest.travelDeskOfficer ? 1 : 0
            travelDeskRequest.bookedStatus = travelDeskRequest.status == "booked" ? 1 : 0
            travelDeskRequest.startDate = this.getStartDate(
              travelDeskRequest.travelAuthorization.dateBackToWork,
              travelDeskRequest.travelAuthorization.travelDuration
            )
          })
          this.loadingData = false
        })
        .catch((e) => {
          console.log(e)
          this.loadingData = false
        })
    },

    getStartDate(endDate, travelDuration) {
      const startDate = new Date(endDate)
      startDate.setDate(startDate.getDate() - 1 * Number(travelDuration))
      return startDate.toISOString()
    },
  },
}
</script>
