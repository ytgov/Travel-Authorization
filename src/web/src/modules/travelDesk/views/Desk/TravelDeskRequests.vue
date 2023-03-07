<template>
    <div class="mx-10 mb-5">
        
        <v-data-table
            :headers="headers"
            :items="travelDeskRequests"
            :sort-by="['bookedStatus','userTravel','startDate']"
            :sort-desc="[false, true, false]"
            :item-class="itemRowBackground"
            multi-sort
            :items-per-page="15"
            class="elevation-1 mt-4">
            
            <template v-slot:[`item.submitDate`]="{ item }">								
                <div>						
                    {{ item.submitDate | beautifyDate }}
                </div>				
            </template>

            <template v-slot:[`item.fullname`]="{ item }">
                {{item.form.firstName+' '+item.form.lastName}}
            </template>	

            <template v-slot:[`item.department`]="{ item }">
                {{item.form.department}}
            </template>	

            <template v-slot:[`item.branch`]="{ item }">
                {{item.form.branch}}
            </template>	

            <template v-slot:[`item.startDate`]="{ item }">
                <div>						
                    {{ item.startDate | beautifyDate }}									
                </div>
            </template>

            <template v-slot:[`item.endDate`]="{ item }">
                <div>						
                    {{ item.form.dateBackToWork | beautifyDate }}
                </div>
            </template>

            <template v-slot:[`item.location`]="{ item }">
                {{getLocationName(item.form.stops)}}
            </template>

            <template v-slot:[`item.requested`]="{ item }">
                {{getRequested(item)}}
            </template>

            <template v-slot:[`item.status`]="{ item }">
                <div v-if="item.status=='submitted' && !item.travelDeskOfficer">Not started <v-icon class="red--text">mdi-flag</v-icon></div>
                <div v-else>{{item.status | getTravelStatus}} 
                    <v-icon v-if="item.status=='submitted'" class="red--text">mdi-flag</v-icon>
                    <v-icon v-if="item.status=='options_ranked'" class="yellow--text">mdi-flag</v-icon>
                    <v-icon v-else-if="item.status=='booked'" class="green--text">mdi-checkbox-marked</v-icon>
                </div>
            </template>

            <template v-slot:[`item.edit`]="{ item }">
                <process-travel-desk-request					
                    :type="item.status=='booked'?'booked':'edit'"
                    @updateTable="updateTable()"
                    :travelDetail="item"/>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    // import Vue from "vue";
    import ProcessTravelDeskRequest from "./ProcessTravelDeskRequest.vue";

    export default {
        components: {
            ProcessTravelDeskRequest
        },
        name: "TravelDeskRequests",
        props: {
            travelDeskRequests: {}
        },
        data() {
            return {
                headers: [	
                    { text: "Submit Date",		  value: "submitDate",		  class: "blue-grey lighten-4"},			
                    { text: "Name",			      value: "fullname",	      class: "blue-grey lighten-4",sortable: false},
                    { text: "Department",		  value: "department",	      class: "blue-grey lighten-4"},
                    { text: "Branch",			  value: "branch",	          class: "blue-grey lighten-4"},					
                    { text: "Travel Start Date",  value: "startDate",	      class: "blue-grey lighten-4"},
                    { text: "Travel End Date", 	  value: "endDate",		      class: "blue-grey lighten-4",sortable: false},
                    { text: "Location",			  value: "location",	      class: "blue-grey lighten-4"},
                    { text: "Requested", 		  value: "requested",         class: "blue-grey lighten-4"},					
                    { text: "Status",             value: "status", 		      class: "blue-grey lighten-4"},
                    { text: "Travel Desk Officer",value: "travelDeskOfficer", class: "blue-grey lighten-4"},
                    { text: "",value: "edit", class: "blue-grey lighten-4", cellClass: "px-0 mx-0",sortable: false}
                ],
                admin: false,
                department: "",				
            };
        },
        mounted() {
        },
        computed: {},
        methods: {
            updateTable() {
                this.$emit("updateTable");
            },
            getLocationName(stops){
                const names = []
                const destinations = this.$store.state.traveldesk.destinations; 
                for(const stop of stops){
                    const location = destinations.filter(dest =>dest.value==stop.locationId)
                    if (location.length > 0){
                        names.push(location[0].text)
                    }
                    
                }
                return names.join(', ')
            },

            getRequested(item){
                const requested = []
                if(item.flightRequests?.length>0) requested.push('flight');
                if(item.hotels?.length>0) requested.push('hotel');
                if(item.rentalCars?.length>0) requested.push('rental car');
                if(item.otherTransportation?.length>0) requested.push('transportation');

                return requested.join(', ')
            },

            itemRowBackground: function (item) {
                return item.userTravel > 0 ? 'red lighten-5' : ''
            }

            // getTravelRequest(item){
            // 	const travelRequest = JSON.parse(JSON.stringify(item))
            // 	return travelRequest
            // }
        }
    };
</script>

<style scoped>
    ::v-deep(tbody tr:nth-of-type(even)) {
        background-color: rgba(0, 0, 0, 0.05);
    }
</style>