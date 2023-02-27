<template>
    <div>
        <title-card class="mt-5" titleWidth="6rem" largeTitle>
            <template #title>
                <div>Grouping</div>
            </template>
            <template #body>               
                <v-data-table
                    :headers="headers"
                    :items="flightOptions"
                    :items-per-page="-1"                               
                    class="mt-3"
                    :hide-default-footer="true"
                    :hide-default-header="true"
                    >                    
                    <template v-slot:[`item.name`]="{ item }">
                        <title-card class="my-5" titleWidth="6rem">
                            <template #title>
                                <div>Group</div>
                            </template>
                            <template #body>
                                <v-row class="mx-3 mt-0 mb-n8">
                                    <v-col cols="3">
                                        <v-text-field								
                                            :error="item.state.costErr"
                                            @input="item.state.costErr=false"								
                                            label="Cost"
                                            prefix="$"
                                            v-model="item.cost"
                                            type="number"								
                                            outlined/>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-text-field								
                                            readonly                                    								
                                            label="Travel Duration"
                                            v-model="item.duration"								
                                            outlined/>
                                    </v-col>
                                </v-row>
                                <div v-for="segment,inx in item.flightSegments" :key="'group-'+segment.FlightSegmentID+'-'+inx">
                                    <flight-segment class="mx-4 my-8" :flightSegment="segment" />
                                </div>
                            </template>
                        </title-card>
                    </template>

                </v-data-table>

                
            </template>
        </title-card>
    </div>
</template>

<script>
    // import Vue from "vue";
    import TitleCard from '../../Common/TitleCard.vue'
    import FlightSegment from "./FlightSegment.vue";


    export default {
        components: {	 
            TitleCard,
            FlightSegment
        },
        name: "FlightOptionsTable",
        props: {
            readonly: Boolean,
            flightOptions: {},
            ungroupedFlightSegments: {}
        },
        data() {
            return {
                tmpId:1,
                admin: false,
                savingData: false,
                selectedSegments:[],
                headers:[ {text: "", value: "name", class: "red"} ],                
            };
        },
        mounted() {	
            this.initForm()					
        },
        methods: {
            
            initForm(){
                // const carRequest = {}							
            },


           
            
        }
    };
</script>

<style scoped >
/* ::v-deep tbody tr:nth-of-type(even) {
   background-color: #FFFFFF !important;
 } */

::v-deep table tbody td {    
    border: 0px solid white !important;
    background-color: #FFFFFF !important;
}

</style>