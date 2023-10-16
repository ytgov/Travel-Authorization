<template>
    <v-card :loading="loadingData" :disabled="loadingData" en class="px-5 pb-15">
        <div v-if="loadingData" class="mt-10" style="text-align: center">loading ...</div>

        <div v-else>
            <v-toolbar  class="" height="100px" flat>
                <v-toolbar-title>
                    <b>Travel Status </b>
                    <b v-if="admin" class="mt-4 blue--text">( {{department}} )</b>
                </v-toolbar-title>
            </v-toolbar>
            <v-card>
                <traveler-requests :authorizedTravels="authorizedTravels" @updateTable="getAuthorizedTravels()" />
            </v-card>
        </div>

    </v-card>
</template>

<script>
    import Vue from "vue";
    import TravelerRequests from "./Requests/TravelerRequests.vue";
    import { TRAVEL_DESK_URL, PROFILE_URL} from "../../../urls";
    import { secureGet } from "../../../store/jwt";
    import locationsApi from "@/apis/locations-api"

    export default {

        name: "TravelRequest",
        components: {
            TravelerRequests
        },
        data() {
            return {
                tabs: null,
                authorizedTravels: [],
                loadingData: false,
                department: "",
                admin: false
            };
        },
        async mounted() {
            this.loadingData=true
            // await this.getUserAuth();
            this.department = this.$store.state.auth.department
            this.admin = Vue.filter("isAdmin")();
            await this.getDestinations();
            await this.getAuthorizedTravels()
            this.loadingData=false
        },

        methods: {

            async getUserAuth() {
                return secureGet(`${PROFILE_URL}`)
                    .then(resp => {
                        this.$store.commit("auth/setUser", resp.data.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },

            async getDestinations() {
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

            async getAuthorizedTravels() {
                this.loadingData=true
                return secureGet(`${TRAVEL_DESK_URL}/authorized-travels/`)
                .then(resp => {
                    const authorizedTravels = resp.data;
                    this.extractAuthorizedTravels(authorizedTravels);
                    this.loadingData=false
                })
                .catch(e => {
                    console.log(e);
                    this.loadingData=false
                });
            },

            extractAuthorizedTravels(authorizedTravels) {

                // console.log(authorizedTravels)
                this.authorizedTravels = []

                for(const authorizedTravel of authorizedTravels){
                    // console.log(authorizedTravel)
                    const phase = this.determineTravelPhase(authorizedTravel)


                    const status = authorizedTravel.status=="Approved"? 'Approved':'Awaiting Director Approval'

                    const startDate = new Date(authorizedTravel.dateBackToWork.slice(0,10) +'T01:00:00.000Z');
                    //console.log(startDate.toUTCString())
                    startDate.setDate(startDate.getDate()-1*Number(authorizedTravel.travelDuration));
                    // console.log(startDate.toISOString())
                    // console.log(startDate.toUTCString())

                    const locationIds = authorizedTravel.stops.map(stop => stop.locationId)

                    this.authorizedTravels.push({
                        id: authorizedTravel.id,
                        email: authorizedTravel.email,
                        phase: phase,
                        name: authorizedTravel.firstName + ' ' + authorizedTravel.lastName,
                        locationIds: locationIds,
                        description: authorizedTravel.purpose,
                        startDate: startDate.toISOString(),
                        endDate:  authorizedTravel.dateBackToWork,
                        status: status,
                        invoiceNumber: authorizedTravel.travelRequest?.invoiceNumber
                    })

                }
            },

            determineTravelPhase(authorizedTravel){
                if(authorizedTravel.status!="Approved") return 'Authorization'
                if(!authorizedTravel?.travelRequest?.status) return 'Travel Approved'
                return Vue.filter("getTravelStatus")(authorizedTravel.travelRequest.status)
            }
        }
};
</script>
