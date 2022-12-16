<template>
    <div class="mt-15 mx-10 mb-5">
        <v-data-table
            :headers="headers"
            :items="travelRequests"
            :items-per-page="5"
            class="elevation-1" 
            :single-select="singleSelect"         
        >
        <template v-slot:item.edit={item}>
            <v-row>
                <div style="width:4.5rem;">
                    <submit-travel :buttonInsideTable="true" buttonName="Edit" v-if="item.status=='Draft'" />
                </div>
                <div style="width:6.75rem;">
                    <approve-travel v-if="item.status=='Submitted'" />
                </div>
                <div style="width:5.75rem;">
                    <print-report :buttonInsideTable="true" buttonName="Print"/>
                </div>                
            </v-row>
        </template>
        
        </v-data-table>
    </div>
</template>

<script>
import PrintReport from "../Common/PrintReport.vue";
import SubmitTravel from "../Common/SubmitTravel.vue"
import ApproveTravel from "./ApproveTravel.vue"

export default {
    components: {PrintReport, SubmitTravel, ApproveTravel},
    name: "Submissions",
    data () {
        return {
            headers: [
                { text: 'Submission Date', value: 'submissionDate', class: 'blue-grey lighten-4'},
                { text: 'Submission',      value: 'submission',     class: 'blue-grey lighten-4'},
                { text: 'Submitter',       value: 'submitter',      class: 'blue-grey lighten-4' },                
                { text: 'Status',          value: 'status',         class: 'blue-grey lighten-4' },
                { text: '',sortable:false, value: 'edit',           class: 'blue-grey lighten-4', width: '18rem'},
            ],
            travelRequests: [],singleSelect: false,
        }
    },
    mounted() {
        this.extractTravelRequests()
    },
    methods: { 
        extractTravelRequests(){
            this.travelRequests = [
                {submission: "TEB ITS staff", status: "Approved"},
                {submission: "Olive Jones",   status: "Submitted"},
                {submission: "Jeff Smith",    status: "Draft"},
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