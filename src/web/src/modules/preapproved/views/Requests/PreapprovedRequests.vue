<template>
    <div class="mx-10 mb-5"> 
        <v-row class="my-0 mx-0"> 
            <submit-travel v-if="admin || patAdmin" buttonName="Submit Selected Travel" class="ml-auto" />
            <print-report v-if="admin || patAdmin" buttonName="Print Report" />  
            <new-travel-request :class="admin || patAdmin ? '': 'ml-auto'"/>
        </v-row>
        <v-data-table
            :headers="headers"
            :items="travelRequests"
            :items-per-page="5"
            class="elevation-1 "
            v-model="selectedRequests"
            item-key="id"
            :show-select="admin || patAdmin"
        ></v-data-table>
    </div>
</template>

<script>
import NewTravelRequest from './NewTravelRequest.vue';
import PrintReport from "../Common/PrintReport.vue";
import SubmitTravel from "../Common/SubmitTravel.vue"

export default {
    components: { NewTravelRequest, PrintReport, SubmitTravel},
    name: "PreapprovedRequests",
    data () {
        return {
            headers: [                
                { text: 'Name',         value: 'name',        class: 'blue-grey lighten-4'},
                { text: 'Department',   value: 'department',  class: 'blue-grey lighten-4'},
                { text: 'Branch',       value: 'branch',      class: 'blue-grey lighten-4' },
                { text: 'TravelDate',   value: 'travelDate',  class: 'blue-grey lighten-4' },
                { text: 'Location',     value: 'location',    class: 'blue-grey lighten-4' },
                { text: 'Purpose Type', value: 'purposeType', class: 'blue-grey lighten-4' },
                { text: 'Reason',       value: 'reason',      class: 'blue-grey lighten-4' },
                { text: 'Status',       value: 'status',      class: 'blue-grey lighten-4' },
            ],
            travelRequests: [],
            admin: true,
            patAdmin:false,
            selectedRequests: [],
        }
    },
    mounted() {
        this.extractTravelRequests()

    },
    methods: { 
        extractTravelRequests(){
            this.travelRequests = [
                {id:1, name: "TEB ITS staff"},
                {id:2, name: "Olive Jones", department:"HPW"},
            ]
        }   
    }
};
</script>

<style scoped>
    ::v-deep(tbody tr:nth-of-type(even)) {
        background-color: rgba(0, 0, 0, .05);
    }
</style>
