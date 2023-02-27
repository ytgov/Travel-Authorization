<template>
    <v-card :loading="loadingData" :disabled="loadingData" en class="px-5 pb-15">
        <div v-if="loadingData" class="mt-10" style="text-align: center">loading ...</div>
        
        <v-toolbar v-if="!loadingData" class="" height="100px" flat>
            <v-toolbar-title>
                <b>Travel Desk Requests </b>                
            </v-toolbar-title>		
        </v-toolbar>		
        <v-card>
            <travel-desk-requests :travelDeskRequests="travelDeskRequests" @updateTable="getTravelDeskRequests()" />
        </v-card>
        
    </v-card>
</template>

<script>
    import Vue from "vue";
    import TravelDeskRequests from "./Desk/TravelDeskRequests.vue";
    import {TRAVEL_DESK_URL,  DESTINATION_URL, USERS_URL} from "../../../urls";
    import { secureGet } from "../../../store/jwt";    

    export default {

        name: "TravelDesk",
        components: {
            TravelDeskRequests
        },
        data() {
            return {
                tabs: null,
                travelDeskRequests: [],
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
                this.loadingData = true
                secureGet(`${DESTINATION_URL}`).then(resp => {
                    const destinations = [];
                    resp.data.forEach(v => {
                        destinations.push({
                            value: v.id,
                            text: v.city + " (" + v.province + ")"
                        });
                    });
                    this.$store.commit("traveldesk/SET_DESTINATIONS", destinations);
                    this.getTravelDeskUsers()
                });
            },
            
            getTravelDeskUsers() {
                this.loadingData = true
                secureGet(`${USERS_URL}/travel-desk-users`).then(resp => {
                    // console.log(resp.data)
                    this.$store.commit("traveldesk/SET_TRAVEL_DESK_USERS", resp.data);
                    this.getTravelDeskRequests()				
                });
            },

            getTravelDeskRequests() {
                this.loadingData = true
                secureGet(`${TRAVEL_DESK_URL}/`)
                    .then(resp => {
                    this.travelDeskRequests= resp.data;
                    this.loadingData = false                    
                })
                .catch(e => {
                    console.log(e);
                    this.loadingData = false;
                });
            },

        }
};
</script>
