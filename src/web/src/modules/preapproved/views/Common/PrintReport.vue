<template>
    <div> 
       <v-dialog v-model="printReportDialog" persistent max-width="950px">

            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    :small="buttonInsideTable"
                    :class="buttonInsideTable? 'my-0' :'mr-5 my-7'"
                    elevation="5"
                    color="primary"                    
                    v-bind="attrs"
                    v-on="on">
                        {{buttonName}}
                </v-btn>
            </template>

            <v-card  class="px-10 py-5">
                <v-row class="mb-3"  justify="space-around" >
                    <v-col cols="5" />
                    <v-col cols="2">
                        <v-btn elevation="5" color="secondary" @click="print">
                            Print
                            <v-icon class="ml-2" color="primary darken-2">mdi-printer</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="3" />
                    <v-col cols="2" align="right">
                        <v-btn elevation="5" color="grey" @click="printReportDialog=false">Close</v-btn>
                    </v-col>
                </v-row>
                

                <div id="pdf"> 
                    <v-app-bar       
                        color="#fff"
                        flat
                        height="70"
                            style="left: 0; border-bottom: 3px #f3b228 solid"
                        > 
                        <img src="/yukon.svg" style="margin: -8px 155px 0 0" height="44" /> 
                    </v-app-bar>
                    
                    <v-data-table
                        style="margin-top:1rem;"
                        :headers="headers"
                        :items="travelRequests"
                        :items-per-page="5"
                        class="elevation-1"
                        hide-default-footer                    
                    ></v-data-table>
                </div>
            </v-card>

       </v-dialog>
    </div>
</template>

<script>
import { Printd } from 'printd'

export default {
  components: {  },
    name: "PrintReport",
    props: {
        buttonName: {type: String},
        buttonInsideTable: {type: Boolean, default: false}
    },
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
            printReportDialog:false,
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
        },

        print(){            			
			const pdfPage = new Printd()
			const styles = [								
				`@media print {
					@page {
						size:8.5in 11.7in !important;
					}
					.new-page{
						page-break-before: always;
						position: relative; top: 8em;
					}
				}`,
                `https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css`,
                `thead th { background-color: #cfd8dc;}`,
                `tbody tr:nth-of-type(even) {background-color: #EFEFEF;}`,
				`table {border: 1px solid #EEEEEE;}`,
			]
			const pageToPrint = document.getElementById("pdf")
			if(pageToPrint) pdfPage.print(pageToPrint, styles)        
        }

    }
};
</script>

<style scoped>
    ::v-deep(tbody tr:nth-of-type(even)) {
        background-color: rgba(0, 0, 0, .05);
    }

    
</style>
