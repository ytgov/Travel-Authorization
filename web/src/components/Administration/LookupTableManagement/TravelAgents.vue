<template>
  <div class="my-5 mx-10">
    <breadcrumbs class="mb-1" />
    <v-alert
      v-if="alertMsg"
      class="mt-5"
      type="info"
      >{{ alertMsg }}</v-alert
    >
    <v-card
      :loading="savingData"
      class="px-5 pb-5"
    >
      <v-row class="mx-0 my-1">
        <new-travel-agent
          :disabled="!admin"
          class="mt-4 mr-5 ml-auto"
          type="New"
          :agency-info="agencyInfo"
          @save="saveTravelAgent"
        />
      </v-row>
      <v-data-table
        v-if="!savingData"
        :headers="headers"
        :items="travelAgentsInfo"
        :items-per-page="15"
        class="elevation-1 mt-4"
      >
        <template #item.edit="{ item }">
          <v-row class="mx-0">
            <new-travel-agent
              type="Edit"
              :agency-info="item"
              @save="saveTravelAgent(item)"
            />
            <v-btn
              style="min-width: 0; padding: 1.115rem 0"
              color="red"
              class="ml-3 px-3"
              small
              @click="deleteTravelAgent(item)"
            >
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import Vue from "vue"
import { TRAVEL_DESK_URL } from "@/urls"

import http from "@/api/http-client"
import Breadcrumbs from "@/components/Breadcrumbs.vue"
import NewTravelAgent from "@/components/Administration/LookupTableManagement/TravelAgentsComponents/NewTravelAgent.vue"

export default {
  name: "TravelAgents",
  components: {
    NewTravelAgent,
    Breadcrumbs,
  },
  data() {
    return {
      admin: false,
      agencyInfo: { agencyName: "", agencyInfo: "" },
      travelAgentsInfo: [],
      savingData: false,
      headers: [
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
      ],
      alertMsg: "",
    }
  },
  async mounted() {
    await this.initForm()
  },
  methods: {
    async initForm() {
      this.savingData = true
      this.admin = Vue.filter("isSystemAdmin")()
      this.travelAgentsInfo = await this.getTravelAgentsInfo()
      this.savingData = false
    },

    async getTravelAgentsInfo() {
      this.alertMsg = ""
      return http
        .get(`${TRAVEL_DESK_URL}/travel-agents/`)
        .then((resp) => {
          return resp.data
        })
        .catch((e) => {
          console.log(e)
          this.alertMsg = e.response.data
          this.savingData = false
        })
    },

    deleteTravelAgent(item) {
      this.savingData = true
      http
        .delete(`${TRAVEL_DESK_URL}/travel-agents/${item.agencyID}`)
        .then(() => {
          //console.log(resp)
          this.initForm()
        })
        .catch((e) => {
          console.log(e)
          this.savingData = false
        })
    },

    saveTravelAgent(agencyInfo) {
      this.savingData = true
      const body = agencyInfo

      http
        .post(`${TRAVEL_DESK_URL}/travel-agents/${agencyInfo.agencyID}`, body)
        .then(() => {
          //console.log(resp)
          this.initForm()
        })
        .catch((e) => {
          console.log(e)
          this.savingData = false
        })
    },
  },
}
</script>

<style scoped></style>
