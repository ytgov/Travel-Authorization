<template>
    <div>
        
        <v-dialog v-model="addNewTravelDialog" persistent max-width="800px">

            <template v-slot:activator="{ on, attrs }">
                <v-btn elevation="5"
                    class="mr-5 my-7"
                    color="primary"
                    @click="initForm()"
                    v-bind="attrs"
                    v-on="on">
                        Add New Travel
                </v-btn>
            </template>

            <v-card>
                <v-card-title  class="primary" style="border-bottom:1px solid black">
                    <div class="text-h5">Add New Travel</div>
                </v-card-title>

                <v-card-text>

                    <v-row class="mt-5">
                        <v-col cols="3">
                            <v-select
                                :error="state.purposeErr"                                
                                @change="state.purposeErr=false;"
                                v-model="purpose"
                                :items="purposeList"
                                label="Purpose"
                                outlined/>
                        </v-col>
                        <v-col cols="1" />
                        <v-col cols="8">                                
                            <v-text-field 
                                :error="state.locationErr"                          
                                v-model="location"
                                label="Location"
                                outlined
                                clearable />
                        </v-col>
                    </v-row>

                    <v-row class="mt-n5">
                        <v-col cols="3">
                            <v-text-field 
                                :error="state.costErr"
                                @input="state.costErr=false"                               
                                v-model="cost"
                                label="Estimated Cost"
                                outlined
                                clearable />
                            <v-text-field
                                :error="state.startDateErr"
                                v-model="startDate"
                                @input="state.unknownDateErr=false"
                                label="Start Date"                                           
                                outlined
                                type="date"/>                                   
                        </v-col>
                        <v-col cols="1" />
                        <v-col cols="8">                                
                            <v-textarea
                                v-model="reason"
                                label="Reason"
                                outlined
                                clearable />
                        </v-col>                            
                    </v-row>

                    <v-row class="mt-n5">
                        <v-col cols="3">                                
                            <v-text-field
                                :error="state.endDateErr"
                                v-model="endDate"
                                @input="state.unknownDateErr=false"
                                label="End Date"                                           
                                outlined
                                type="date"/>                                   
                        </v-col>
                        <v-col cols="1" />
                        <v-col cols="8">
                            <v-row>
                                <v-col cols="5">
                                    <v-checkbox
                                        v-model="unknownDate"
                                        label="exact date unknown"                                        
                                        @change="selectUnknownDate()"
                                        :error-messages="state.unknownDateErr? 'Either select Start and End Dates or Check this Box' :'' "
                                        />
                                </v-col>
                                <v-col cols="5">                                
                                    <v-select
                                        @change="state.anticipatedMonthErr=false"
                                        :error="state.anticipatedMonthErr"
                                        :disabled="!unknownDate"
                                        v-model="anticipatedMonth"                                           
                                        :items="monthList"
                                        label="Anticipated Month"
                                        outlined/>                                    
                                </v-col>
                            </v-row>
                        </v-col>                            
                    </v-row>
                    
                    <div id="traveller-detail" >Traveller Details</div>
                    <v-card elevation="2" outlined >
                        <v-row class="mt-5 mx-3">
                            <v-col cols="6">
                                <v-select
                                    :error="state.departmentErr"
                                    @change="state.departmentErr=false;"
                                    v-model="department"
                                    :items="departmentList"
                                    item-text="name"
                                    item-value="abbr"
                                    label="Department"
                                    outlined/>
                            </v-col>
                            <v-col cols="6">                                
                                <v-select
                                    :error="state.branchErr"
                                    @change="state.branchErr=false;"
                                    v-model="branch"
                                    :items="branchList"
                                    item-text="name"
                                    item-value="abbr"
                                    label="Branch"
                                    outlined/>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="1"/>
                            <v-col cols="3">
                                <v-checkbox                                    
                                    :error-messages="state.undefinedTravellerErr? 'Either add Travelers` name in below or select this option':(undefinedTravellerHint? undefinedTravellerHint:'')"
                                    @change="selectUndefinedTraveller()"
                                    v-model="undefinedTraveller"
                                    label="traveller undefined"
                                    />
                            </v-col>
                            <v-col cols="4">                                
                                <v-text-field
                                    @input="addUndefinedTraveller()"
                                    :error="state.travellerNumErr"
                                    :disabled="!undefinedTraveller"
                                    label="Number of Travellers"
                                    v-model="travellersNum"
                                    type="number"
                                    outlined                                    
                                    />                                    
                            </v-col>
                        </v-row>
                        
                        <v-row class="mt-5 mx-3">
                            <v-col cols="8">
                                <v-data-table
                                    :headers="headers"
                                    :items="travellers"
                                    hide-default-footer
                                    class="elevation-1 "            
                                ></v-data-table>
                            </v-col>
                            <v-col cols="4">
                                <v-btn
                                    :disabled="undefinedTraveller"
                                    class="ml-auto mr-5 my-7"
                                    color="primary"
                                    @click="addTravellerName">
                                        Add Traveller
                                </v-btn>                     
                            </v-col>
                        </v-row>

                         <v-row class=" mx-3">                           
                            <v-col cols="12">                                
                                <v-textarea
                                    v-model="travellerNotes"
                                    label="Traveller Notes"
                                    outlined
                                    clearable />
                            </v-col>                            
                        </v-row>

                    </v-card>
                        
                </v-card-text>

                <v-card-actions>                          
                    <v-btn color="grey darken-5" @click="addNewTravelDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn class="ml-5" color="red darken-5" @click="addNewTravelDialog = false">
                        Delete
                    </v-btn>
                    <v-btn class="ml-auto" color="green darken-1" @click="saveNewTravelRequest()">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>




        <v-dialog v-model="travellerDialog" persistent max-width="400px">
            <v-card>
                <v-card-title class="primary" style="border-bottom:1px solid black">
                    <div class="text-h5">Traveller</div>
                </v-card-title>

                <v-card-text>
                    <v-row class="mt-5">
                        <v-col cols="12">
                            <v-select
                                @change="adNameErr=false;"
                                :error="adNameErr"
                                :items="adNameList"
                                v-model="adName"
                                label="Traveller Name"
                                outlined/>
                        </v-col>                        
                    </v-row>
                </v-card-text>

                <v-card-actions>                          
                    <v-btn color="grey darken-5" @click="travellerDialog = false">
                        Cancel
                    </v-btn>                    
                    <v-btn class="ml-auto" color="green darken-1" @click="addTraveller">
                        Add
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>

import Vue from 'vue'

export default {
    name: "NewTravelRequest",
    data () {
        return {
            headers: [
                { text: 'Name',   value: 'name',       class: 'blue-grey lighten-4'},
                { text: 'Dept.',  value: 'department', class: 'blue-grey lighten-4'},
                { text: 'Branch', value: 'branch',     class: 'blue-grey lighten-4' },
            ],
            travellers: [],
            purposeList:['Conference', 'Meeting', 'Training'],
            purpose:"",
            addNewTravelDialog: false,
            unknownDate: false,
            location:"",
            cost:"",
            reason:"",
            startDate:"",
            endDate:"",
            department:"",
            departmentList: [
                {name:'Highways and Public Works',abbr:'HPW'}, 
                {name:'Digital ',abbr:'DGT'},
            ],
            branch:"",
            branchList: [
                {name:'Transportation Engineering',abbr:'TEB'},
                {name:'Information and Communication',abbr:'ICT'},
            ],
            undefinedTraveller: false,
            undefinedTravellerHint:"",
            travellersNum:null,
            anticipatedMonth:"",
            travellerNotes:"",
            monthList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            travellerDialog:false,
            adNameList: ['Sally Smith', 'Harry Styles'],
            adName:"",

            state:{
                purposeErr:false,
                costErr:false,
                locationErr:false,
                departmentErr:false,
                branchErr:false,
                anticipatedMonthErr:false,
                travellerNumErr:false,
                startDateErr:false,
                endDateErr:false,
                unknownDateErr:false,
                undefinedTravellerErr:false,
            },

            adNameErr:false,
        }
    },
    mounted() {
       
    },
    methods: { 
        
        addTraveller(){
            if(this.adName){
                this.travellerDialog = false
                this.travellers.push({name:this.adName, department:this.department, branch:this.branch})
            }else
                this.adNameErr=true;
        },
        
        addTravellerName(){
            this.state.undefinedTravellerErr =false;
            this.undefinedTravellerHint=""
            this.adNameErr=false;
            this.state.departmentErr=this.department? false: true;
            this.state.branchErr=this.branch? false: true;
            if(this.department && this.branch) this.travellerDialog=true;
        },

        selectUnknownDate(){
            this.state.unknownDateErr=false
            if(!this.unknownDate){
                this.anticipatedMonth=""
                this.state.anticipatedMonthErr=false
            }
        },

        selectUndefinedTraveller(){
            this.undefinedTravellerHint=""
            this.state.departmentErr=this.department? false: true;
            this.state.branchErr=this.branch? false: true;
            if(!this.undefinedTraveller){
                this.travellers=[]
                return
            }
            if(this.department && this.branch){ 
                this.state.undefinedTravellerErr=false
                this.addUndefinedTraveller()
            }
            else
                Vue.nextTick(() => {
                    this.undefinedTraveller=false;
                    this.undefinedTravellerHint="Please Select the Department and Branch First!"
                })
        },


        addUndefinedTraveller(){
            this.state.travellerNumErr=false
            if(this.travellersNum>0){
                this.travellers=[{
                    name:(this.department+' '+this.branch+' staff'),
                    department: this.department,
                    branch: this.branch
                }]                
            }
        },

        saveNewTravelRequest(){
            this.state.purposeErr=this.purpose? false: true;
            this.state.costErr=this.cost? false: true;
            this.state.locationErr= location? false: true;                
            
            this.state.unknownDateErr = !this.startDate && !this.endDate && !this.unknownDate ? true: false;
            this.state.anticipatedMonthErr = this.unknownDate && !this.anticipatedMonth? true: false

            this.state.startDateErr = !this.startDate && this.endDate && !this.unknownDate? true: false;
            this.state.endDateErr = this.startDate && !this.endDate && !this.unknownDate? true: false;
                                  
            this.state.undefinedTravellerErr = !this.undefinedTraveller && this.travellers.length==0 ? true : false
            this.state.travellerNumErr = this.undefinedTraveller && (!this.travellersNum || this.travellersNum<1)? true: false

            for(const key of Object.keys(this.state)){                
                if(this.state[key])return
            }

            this.addNewTravelDialog = false
        },

        initForm(){
            this.travellers = [],
            this.purpose = ""            
            this.unknownDate=false
            this.location=""
            this.cost=""
            this.reason=""
            this.startDate=""
            this.endDate=""
            this.department=""            
            this.branch=""            
            this.undefinedTraveller=false
            this.undefinedTravellerHint=""
            this.travellersNum=null
            this.anticipatedMonth=""
            this.travellerNotes=""            
            this.travellerDialog=false            
            this.adName=""

            this.initStates()
        },

        initStates(){ 
            this.adNameErr=false
            this.undefinedTravellerHint=""           
            for(const key of Object.keys(this.state)){                
                this.state[key]=false
            }
        }

    }
};
</script>


<style scoped>
    #traveller-detail {
        position: relative;
        top: 12px;
        left: 15px;
        width: 20%;
        font-size: 15pt;
        height: 100%;
        background: rgb(255, 255, 255);
        z-index:99;
    }

    ::v-deep(tbody tr:nth-of-type(even)) {
        background-color: rgba(0, 0, 0, .05);
    }
</style>
