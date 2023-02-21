<template>
    <v-card :loading="loadingData" :disabled="loadingData" en class="px-5 pb-15">
        <div v-if="loadingData" class="mt-10" style="text-align: center">loading ...</div>
        <v-alert v-if="alertMsg" class="mt-5" type="warning">{{ alertMsg }}</v-alert>
        <v-toolbar v-if="!loadingData" class="" height="100px" flat>
            <v-toolbar-title>
                <b>Travel Status </b>
                <b v-if="admin" class="mt-4 blue--text">( {{department}} )</b>
            </v-toolbar-title>		
        </v-toolbar>		
        <v-card>
            <travel-desk-requests :authorizedTravels="authorizedTravels" @updateTable="getPreapprovedTravel()" />
        </v-card>
        
    </v-card>
</template>

<script>
    import Vue from "vue";
    import TravelDeskRequests from "./Requests/TravelDeskRequests.vue";
    import { FORM_URL, DESTINATION_URL } from "../../../urls";
    import { secureGet } from "../../../store/jwt";
    // import moment from 'moment';

    export default {
    name: "Preapproved",
    components: {
        TravelDeskRequests
    },
    data() {
        return {
            tabs: null,
            authorizedTravels: [],
            loadingData: false,			
            alertMsg: "",
            department: "",
            admin: false
        };
    },
    mounted() {
        //TODO: get all travel for user
        // this.getEmployees();
        //this.getPreapprovedTravel()
        this.getDestinations()
        
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
        // getEmployees() {
        // 	this.loadingData = true;
        // 	secureGet(`${LOOKUP_URL}/employees`)
        // 		.then(resp => {
        // 			this.$store.commit("preapproved/SET_EMPLOYEES", resp.data);
        // 			this.getDepartmentBranch();
        // 		})
        // 		.catch(e => {
        // 			console.log(e);
        // 		});
        // },

        // getDepartmentBranch() {
        // 	secureGet(`${LOOKUP_URL}/department-branch`)
        // 		.then(resp => {
        // 			this.$store.commit("preapproved/SET_DEPARTMENT_BRANCH", resp.data);
        // 			this.getTravelPurposes();
        // 		})
        // 		.catch(e => {
        // 			console.log(e);
        // 		});
        // },

        // getTravelPurposes(){
        // 	secureGet(`${LOOKUP_URL}/travelPurpose`)
        // 		.then(resp => {          
        // 			this.$store.commit("preapproved/SET_TRAVEL_PURPOSES", resp.data);
        // 			this.getPreapprovedTravel();
        // 		})
        // 		.catch(e => {
        // 			console.log(e);
        // 		});
        // },

        // getPreapprovedTravel() {
        // 	this.loadingData = true;
        // 	secureGet(`${PREAPPROVED_URL}/`)
        // 		.then(resp => {
        // 			this.authorizedTravels = resp.data.map(x => ({
        // 				...x,
        // 				isSelectable: x.status != "Approved" && x.status != "Declined"
        // 			}));
        // 			this.getPreapprovedTravelSubmissions();
        // 		})
        // 		.catch(e => {
        // 			console.log(e);
        // 		});
        // },

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
            console.log(authorizedTravels)
            this.authorizedTravels = []
            // if (this.$store.state.auth.department){
            const departmentAuthorizedTravels = authorizedTravels.filter(authTravel => 
                (authTravel.department == this.$store.state.auth.department &&
                    (authTravel.status=="Approved")// || authTravel.status=="Submitted")
                )
            )
            for(const authorizedTravels of departmentAuthorizedTravels){
                console.log(authorizedTravels)
                const phase = authorizedTravels.status=="Approved"? 'Travel Approved':'Authorization'
                const status = authorizedTravels.status=="Approved"? 'Approved':'Awaiting Director Approval'
                const startDate = new Date(authorizedTravels.dateBackToWork);                 
                console.log(startDate.toUTCString())
                startDate.setDate(startDate.getDate()-1*Number(authorizedTravels.travelDuration));
                console.log(startDate.toISOString())
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
            // this.alertMsg = "";
            // if (!this.$store.state.auth.department) {
            // 	const email = this.$store.state.auth.user.email;
            // 	const employee = this.$store.state.preapproved.employees.filter(emp => emp.email == email);
            // 	if (employee.length > 0) {
            // 	this.$store.dispatch("UpdateUserDepartment", employee[0].department);
            // 	} else {
            // 	this.alertMsg = "Your department is undefined. Please contact system administrator.";
            // 	}
            // }
            // this.loadingData = false;
        }
    }
};
</script>
