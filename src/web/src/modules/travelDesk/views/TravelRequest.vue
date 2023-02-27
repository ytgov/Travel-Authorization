<template>
    <v-card :loading="loadingData" :disabled="loadingData" en class="px-5 pb-15">
        <div v-if="loadingData" class="mt-10" style="text-align: center">loading ...</div>
        
        <v-toolbar v-if="!loadingData" class="" height="100px" flat>
            <v-toolbar-title>
                <b>Travel Status </b>
                <b v-if="admin" class="mt-4 blue--text">( {{department}} )</b>
            </v-toolbar-title>		
        </v-toolbar>		
        <v-card>
            <traveler-requests :authorizedTravels="authorizedTravels" @updateTable="getAuthorizedTravels()" />
        </v-card>
        
    </v-card>
</template>

<script>
    import Vue from "vue";
    import TravelerRequests from "./Requests/TravelerRequests.vue";
    import { FORM_URL, DESTINATION_URL } from "../../../urls";
    import { secureGet } from "../../../store/jwt";    

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
        mounted() {
            
            this.getDestinations();        
            this.department = this.$store.state.auth.department
            this.admin = Vue.filter("isAdmin")();
        },
        methods: {
            getDestinations() {
                secureGet(`${DESTINATION_URL}`).then(resp => {
                    const destinations = [];
                    resp.data.forEach(v => {
                        destinations.push({
                            value: v.id,
                            text: v.city + " (" + v.province + ")"
                        });
                    });
                    this.$store.commit("traveldesk/SET_DESTINATIONS", destinations);
                    this.getAuthorizedTravels()				
                });
            },        

            getAuthorizedTravels() {
                secureGet(`${FORM_URL}/`)
                    .then(resp => {
                    const authorizedTravels = resp.data;
                    this.extractAuthorizedTravels(authorizedTravels);
                })
                .catch(e => {
                    console.log(e);
                });
            },

            extractAuthorizedTravels(authorizedTravels) {

                //console.log(authorizedTravels)
                this.authorizedTravels = []
                // if (this.$store.state.auth.department){
                const departmentAuthorizedTravels = authorizedTravels.filter(authTravel => 
                    (authTravel.department == this.$store.state.auth.department &&
                        (authTravel.status=="Approved")// || authTravel.status=="Submitted")
                    )
                )
                for(const authorizedTravels of departmentAuthorizedTravels){
                    //console.log(authorizedTravels)
                    const phase = authorizedTravels.status=="Approved"? 'Travel Approved':'Authorization'
                    const status = authorizedTravels.status=="Approved"? 'Approved':'Awaiting Director Approval'
                    const startDate = new Date(authorizedTravels.dateBackToWork);                 
                    //console.log(startDate.toUTCString())
                    startDate.setDate(startDate.getDate()-1*Number(authorizedTravels.travelDuration));
                    //console.log(startDate.toISOString())
                    const locationIds = authorizedTravels.stops.map(stop => stop.locationId)
                                            
                    this.authorizedTravels.push({	
                        id: authorizedTravels.id,
                        email: authorizedTravels.email,
                        phase: phase,
                        name: authorizedTravels.firstName + ' ' + authorizedTravels.lastName,
                        locationIds: locationIds,						 
                        description: authorizedTravels.purpose, 
                        startDate: startDate.toISOString(), 
                        endDate:  authorizedTravels.dateBackToWork, 
                        status: status
                    })                
                    
                }
                
            }
        }
};
</script>
