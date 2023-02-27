<template>
    <div>
        <title-card class="mt-5" titleWidth="6.5rem" largeTitle>
            <template #title>
                <div>Segments</div>
            </template>
            <template #body>
                <v-row class="mx-0">
                    <v-btn                
                        @click="addFlightSegment()"
                        style="min-width: 0"
                        color="primary"
                        class="ml-3 my-5 px-3 py-4"
                        small>Add New Flight Segment
                    </v-btn>
                    <v-btn 
                        :disabled="selectedSegments.length==0"               
                        @click="groupFlightSegments()"
                        style="min-width: 0"
                        color="primary"
                        class="ml-auto mr-3 my-5 px-3 py-4"
                        small>Group Selected
                    </v-btn>
                </v-row>
                <v-data-table
                    :headers="headers"
                    :items="flightSegments"
                    :items-per-page="-1"            
                    class="elevation-1 mt-3"
                    v-model="selectedSegments"
                    :hide-default-footer="true"
                    :hide-default-header="true"
                    item-key="tmpId"    
                    :show-select="true"
                    @item-selected="segmentSelected"
                    >

                    <!-- <template v-slot:[`header.data-table-select`]></template> -->
                    <template v-slot:[`item.name`]="{ item }">
                        <flight-segment class="mx-4 my-8" :flightSegment="item" />
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
        name: "FlightSegmentsTable",
        props: {
            readonly: Boolean,
            flightSegments: {},
            flightOptions: {},

        },
        data() {
            return {
                tmpId:1,
                admin: false,
                savingData: false,
                selectedSegments:[],                
                headers:[ {text: "", value: "name", class: ""} ],


            };
        },
        mounted() {	
            this.initForm()					
        },
        methods: {
            // updateTable(type) {
                
            // 	// if(type=='Add New'){
            // 	// 	this.carRequest.tmpId=this.tmpId
            // 	// 	this.rentalCars.push(JSON.parse(JSON.stringify(this.carRequest)))
            // 	// 	this.tmpId++
            // 	// }
            // },	

            newForm(){
                const today = new Date()
                this.questions.push({
                    creatingDate: today.toISOString(),
                    question:"",
                    response:"",
                    requestType:"Hotel"
                })
            },
            
            initForm(){
                // const carRequest = {}							
            },

            addFlightSegment(){
                const state ={
					flightErr:false,
                    departDateErr:false,
                    departTimeErr:false,
                    departLocationErr:false,
                    arriveDateErr:false,
                    arriveTimeErr:false,
                    arriveLocationErr:false,
                    durationErr:false,
                    classErr:false,
                    statusErr:false,
				}
                const  flightSegment= {
                    tmpId:this.tmpId,
                    flightNumber:"",
                    departDate:"",
                    departDay:"",
                    departTime:"",
                    departLocation:"",
                    arriveDate:"",
                    arriveDay:"",
                    arriveTime:"",
                    arriveLocation:"",
                    duration:"",
                    status:"",
                    class:"",
                    sortOrder:null,
                    state:state
                }
                this.tmpId++;
                this.flightSegments.push(flightSegment)
            },

            segmentSelected(event){
                console.log(event)
                this.checkStates(event.item)
            },

            checkStates(item){
                const state={
					flightErr: item.flightNumber? false:true,
                    departDateErr: item.departDay? false:true,
                    departTimeErr: item.departTime? false:true,
                    departLocationErr: item.departLocation? false:true,
                    arriveDateErr: item.arriveDay? false:true,
                    arriveTimeErr: item.arriveTime? false:true,
                    arriveLocationErr: item.arriveLocation? false:true,
                    durationErr: item.duration? false:true,
                    classErr: item.class? false:true,
                    statusErr: item.status? false:true,
				}
                item.state=state

                // Vue.nextTick(() => {
                    for (const key of Object.keys(state)) {
                        if (state[key]){
                            this.selectedSegments = this.selectedSegments.filter(seg => seg.tmpId != item.tmpId);
                            return false;
                        }
                    }
                    return true
                // });                    
                
            },

            groupFlightSegments(){
                const tmpids = []
                let durationHours=0
                let durationMinutes=0
                let sortOrder=1;
                for(const segment of this.selectedSegments){
                    tmpids.push(segment.tmpId)
                    segment.sortOrder=sortOrder;
                    sortOrder++;
                    const duration = this.extractDuration(segment.duration)
                    durationHours += Number(duration.hours);
                    durationMinutes += Number(duration.minutes);
                    if(this.checkStates(segment)==false){
                        this.selectedSegments=[];
                        return null;
                    }
                }
                // console.log(durationHours+" Hour(s) "+ durationMinutes+ " Minute(s)")

                const flightOption={
                    cost:"",
                    leg:"",                    
                    state:{costErr:false},
                    flightPreference:"",
                    duration:(durationHours+" Hour(s) "+ durationMinutes+ " Minute(s)"),
                    flightSegments:JSON.parse(JSON.stringify(this.selectedSegments))
                }
                this.flightOptions.push(flightOption)
                console.log(tmpids)

                
                for(const tmpid of tmpids){
                    const delIndex = this.flightSegments.findIndex(segment => (segment.tmpId == tmpid));								
                    if(delIndex>=0) this.flightSegments.splice(delIndex,1)
                }			
                
                this.selectedSegments =[]
            },

            extractDuration(duration){
                // console.log(duration.match(/\d+/g))
                let hours=0;
                let minutes=0;                
                const time = duration.match(/\d+/g)
                if(time?.length==2){
                    hours=time[0];
                    minutes=time[1];
                }
                else if(time?.length==1){
                    minutes= duration.includes('m') || duration.includes('M') ? time[0]:0
                    hours= duration.includes('h') || duration.includes('H') ? time[0]:0
                }
                
                return { hours:hours, minutes:minutes }
            },

            // editRentalCar(item) {				
            // 	// this.carRequest=item						
            // },

            // removeRentalCar(item) {
            // 	// console.log(item)
            // 	// let delIndex = -1
            // 	// if(item.rentalVehicleID>0)
            // 	// 	delIndex = this.rentalCars.findIndex(rentalCar => (rentalCar.rentalVehicleID && rentalCar.rentalVehicleID == item.rentalVehicleID) );
            // 	// else
            // 	// 	delIndex = this.rentalCars.findIndex(rentalCar => (rentalCar.tmpId && rentalCar.tmpId == item.tmpId));				
            // 	// console.log(delIndex)
            // 	// if(delIndex>=0) this.rentalCars.splice(delIndex,1)
            // }
        }
    };
</script>

<style scoped >
    ::v-deep table tbody td {    
        border: 0px solid white !important;
        background-color: #FFFFFF !important;
    }
</style>