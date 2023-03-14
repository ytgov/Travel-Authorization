<template>
    <div>
        <v-alert v-if="alertMsg" class="mt-5" type="info">{{ alertMsg }}</v-alert>
        <v-card :loading="savingData" class="px-5 pb-5">
            <v-row class="mx-0">
                <new-travel-agent
                    :disabled="!admin"                
                    class="mt-4 mr-5 ml-auto"					
                    type="New"
                    @save="saveTravelAgent"
                    :agencyInfo="agencyInfo"/>
            </v-row>	
            <v-data-table
                v-if="!savingData"
                :headers="headers"
                :items="travelAgentsInfo"
                :items-per-page="15"
                class="elevation-1 mt-4">
                <template v-slot:[`item.edit`]="{ item }">
                    <v-row class="mx-0">
                        <new-travel-agent					
                            type="Edit"
                            @save="saveTravelAgent(item)"
                            :agencyInfo="item"/>
                        <v-btn           
                            @click="deleteTravelAgent(item)"
                            style="min-width: 0; padding:1.115rem 0;"
                            color="red"
                            class="ml-3 px-3"
                            small> <v-icon> mdi-close </v-icon>
                        </v-btn>
                    </v-row>				
                </template>            
            </v-data-table>			
        </v-card>
    </div>
</template>

<script>
    import Vue from "vue";
    import NewTravelAgent from './TravelAgentsComponents/NewTravelAgent.vue'
    import { TRAVEL_DESK_URL } from "../../../urls"
    import { secureGet, securePost, secureDelete } from '../../../store/jwt';

    export default {		
        name: "TravelAgents",
        components: {
            NewTravelAgent
        },        
        data() {
            return {
                admin: false,
                agencyInfo: {agencyName:'',agencyInfo:''},
                travelAgentsInfo: [],
                savingData: false,				
                headers: [	
                    { text: "Agency Name", value: "agencyName",	class: "blue-grey lighten-4"},			
                    { text: "Agency Info", value: "agencyInfo",	class: "blue-grey lighten-4",sortable: false},
                    { text: "", 	       value: "edit",	    class: "blue-grey lighten-4", width:"8rem", cellClass: "px-0 mx-0",sortable: false}
                ],
                alertMsg:""
            };
        },
        async mounted() {	
            await this.initForm()	
        },
        methods: {			

            async initForm(){
                this.savingData=true
                this.admin = Vue.filter("isSystemAdmin")();
                this.travelAgentsInfo = await this.getTravelAgentsInfo()                
                this.savingData=false
            },

            async getTravelAgentsInfo() {
                this.alertMsg=""
                return secureGet(`${TRAVEL_DESK_URL}/travel-agents/`)
                    .then(resp => {						
                        return(resp.data)
                    })
                    .catch(e => {
                        console.log(e);
                        this.alertMsg = e.response.data
                        this.savingData=false
                    });
            },

            deleteTravelAgent(item){
                this.savingData=true
                secureDelete(`${TRAVEL_DESK_URL}/travel-agents/${item.agencyID}`)
                    .then(() => {
                        //console.log(resp)               
                        this.initForm()
                })
                .catch(e => {
                    console.log(e);
                    this.savingData=false
                });                
            },
           
            saveTravelAgent(agencyInfo){

                this.savingData=true
                const body = agencyInfo

                securePost(`${TRAVEL_DESK_URL}/travel-agents/${agencyInfo.agencyID}`, body)
                    .then(() => {
                        //console.log(resp)
                        this.initForm()							
                })
                .catch(e => {
                    console.log(e);
                    this.savingData=false
                });
            },

        }
    };
</script>

<style scoped>
</style>