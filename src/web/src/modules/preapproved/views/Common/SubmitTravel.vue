<template>
    <div> 
       <v-dialog v-model="submitTravelDialog" persistent max-width="950px">

            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    :small="buttonInsideTable"
                    :class="buttonInsideTable? 'my-0' :'mr-5 my-7'"
                    elevation="5"
                    color="primary"
                    @click="extractTravelRequests()"                    
                    v-bind="attrs"
                    v-on="on">
                        {{buttonName}}
                </v-btn>
            </template>

            <v-card >
                <v-card-title  style="border-bottom:1px solid black">
                    <div class="text-h5">Submit/Draft Travel Request </div>
                </v-card-title>

                <v-card-text> 
                    <v-row class="mt-3" >
                        <v-btn class="ml-auto mr-5" color="primary" >
                            Add Request
                        </v-btn>
                    </v-row>                   
                    <v-data-table
                        style="margin-top:1rem;"
                        :headers="headers"
                        :items="travelRequests"
                        :items-per-page="5"
                        class="elevation-1"
                        hide-default-footer                    
                    >
                        <template v-slot:item.remove={item}>
                            <v-btn @click="removeTravel(item)" style="min-width:0;" color="transparent" class="px-1" small>
                                <v-icon class="" color="red">mdi-delete</v-icon>
                            </v-btn>
                        </template>
                    
                    </v-data-table>
                </v-card-text>

                <v-card-actions>                          
                    <v-btn color="grey darken-5" @click="submitTravelDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn class="ml-auto" color="lime darken-1" @click="submitTravelvelDialog = false">
                        Save Draft
                    </v-btn>
                    <v-btn class="ml-5" color="green darken-1" @click="saveNewTravelRequest()">
                        Submit
                    </v-btn>
                </v-card-actions>
                
            </v-card>

       </v-dialog>
    </div>
</template>

<script>

export default {
  components: {  },
    name: "SubmitTravel",
    props: {
        buttonName: {type: String},
        buttonInsideTable: {type: Boolean, default: false}
    },
    data () {
        return {
            headers: [                
                { text: 'Name',           value: 'name',     class: 'blue-grey lighten-4'},                
                { text: 'Branch',         value: 'branch',   class: 'blue-grey lighten-4' },
                { text: 'Reason',         value: 'reason',   class: 'blue-grey lighten-4' },                
                { text: 'Location',       value: 'location', class: 'blue-grey lighten-4' },
                { text: '',sortable:false,value: 'remove',   class: 'blue-grey lighten-4', width: "2rem" },
            ],
            travelRequests: [],
            submitTravelDialog:false,
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

        removeTravel(item){
            this.travelRequests= this.travelRequests.filter(travel => travel.id != item.id)
        },       

    }
};
</script>

<style scoped>
    ::v-deep(tbody tr:nth-of-type(even)) {
        background-color: rgba(0, 0, 0, .05);
    }

    
</style>
