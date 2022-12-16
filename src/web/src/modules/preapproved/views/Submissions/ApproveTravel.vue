<template>
    <div> 
       <v-dialog v-model="approveTravelDialog" persistent max-width="950px">

            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    small
                    class="my-0"
                    elevation="5"
                    color="primary"
                    @click="extractTravelRequests()"                    
                    v-bind="attrs"
                    v-on="on">
                        Approve
                </v-btn>
            </template>

            <v-card >
                <v-card-title  style="border-bottom:1px solid black">
                    <div class="text-h5"> Approval </div>
                </v-card-title>

                <v-card-text> 

                    <v-row class="mt-10">
                        <v-col cols="6">                                
                            <v-text-field 
                                :error="approvedByErr" 
                                @input="approvedByErr=false;"                         
                                v-model="approvedBy"
                                label="Approved By"
                                outlined
                                clearable />
                        </v-col>
                        <v-col cols="1" />
                        <v-col cols="3">                          
                            <v-text-field
                                :error="approvalDateErr"
                                v-model="approvalDate"                                
                                label="Approval Date"                                           
                                outlined
                                type="date"/>                                   
                        </v-col>
                        <v-col cols="1" />
                    </v-row>


                    <v-row class="mt-1 mb-5" align="center" justify="center">
                        <v-col cols="4">
                            <v-btn class="ml-1" color="primary" elevation="5" @click="uploadApproval">
                                Upload Approval
                                <input id="inputfile" type="file" style="display: none;" accept="application/pdf,image/x-png,image/jpeg" @change="handleSelectedFile" onclick="this.value=null;">
                            </v-btn>
                        </v-col>
                        <v-col cols="1" />
                        <v-col class="blue--text text-h6 text-decoration-underline" cols="7">
                            {{approvalFileName}}
                        </v-col>
                    </v-row>   

                    <v-row class="mt-1 mb-5" >
                        <v-col>
                            <v-data-table
                                :headers="headers"
                                :items="travelRequests"
                                :items-per-page="5"
                                class="elevation-1"
                                hide-default-footer                    
                            >
                                <template v-slot:item.status={item}>                                    
                                    <v-select 
                                        :background-color="item.status=='Declined'?'red lighten-4':(item.status=='Approved'? 'green lighten-4':'grey lighten-4')"
                                        class="my-0 py-0"
                                        dense hide-details                                                                                                           
                                        @change="changeStatus(item)"
                                        v-model="item.status"
                                        :items="statusList"
                                        label=""
                                        solo/>                                
                                </template>
                            
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>                          
                    <v-btn color="grey darken-5" @click="approveTravelDialog = false">
                        Cancel
                    </v-btn>                   
                    <v-btn class="ml-auto" color="green darken-1" @click="saveNewTravelRequest()">
                        Save
                    </v-btn>
                </v-card-actions>
                
            </v-card>

       </v-dialog>
    </div>
</template>

<script>

export default {
  components: {  },
    name: "ApproveTravel",
    props: {
       
    },
    data () {
        return {
            headers: [                
                { text: 'Name',      value: 'name',     class: 'blue-grey lighten-4'},                
                { text: 'Branch',    value: 'branch',   class: 'blue-grey lighten-4' },
                { text: 'Reason',    value: 'reason',   class: 'blue-grey lighten-4' },                
                { text: 'Location',  value: 'location', class: 'blue-grey lighten-4' },
                { text: 'Status',    value: 'status',   class: 'blue-grey lighten-4', sortable:false, width:'11rem'},
            ],
            travelRequests: [],
            approvedBy:"",
            approvedByErr:false,
            approvalDate:"",
            approvalDateErr:false,
            statusList: ['Approved','Declined','Submitted'],
            approveTravelDialog:false,
            approvalFile:{},
            approvalFileName:"",
        }
    },
    mounted() {
        this.extractTravelRequests()
    },
    methods: { 
        
        extractTravelRequests(){
            
            this.approvalFileName="";
            this.approvalFile={};
            this.approvedBy="";
            this.approvalDate="";
            this.approvedByErr=false;
            this.approvalDateErr=false;

            this.travelRequests = [
                {id:1, name: "TEB ITS staff", status:"Submitted"},
                {id:2, name: "Olive Jones",  status:"Submitted"},
            ]
        },

        uploadApproval(){
            const el = document.getElementById("inputfile");
            if(el) el.click();
        },

        handleSelectedFile(event){

            event.preventDefault();
            event.stopPropagation();
            
            if (event.target.files && event.target.files[0]) 
            {
                this.approvalFile = event.target.files[0];
                this.approvalFileName = this.approvalFile.name
            }
        },

        changeStatus(item){
            console.log(item)
            // this.travelRequests= this.travelRequests.filter(travel => travel.id != item.id)
        },       

    }
};
</script>

<style scoped>
    ::v-deep(tbody tr:nth-of-type(even)) {
        background-color: rgba(0, 0, 0, .05);
    }
</style>
