<template>
    <div>
        <title-card class="mt-5" titleWidth="6.5rem" largeTitle>
            <template #title>
                <div>Segments</div>
            </template>
            <template #body>
                <v-row class="mx-0">
                    <v-btn                
                        @click="addBlankFlightSegment()"
                        style="min-width: 0"
                        color="primary"
                        class="ml-3 my-5 px-3 py-4"
                        small>Add New Flight Segment
                    </v-btn>
                    <v-btn 
                        :disabled="selectedSegments.length==0"               
                        @click="removeFlightSegments()"
                        style="min-width: 0"
                        color="red"
                        class="ml-auto mr-3 my-5 px-3 py-4"
                        small>Delete Selected
                    </v-btn>
                    <v-btn 
                        :disabled="selectedSegments.length==0"               
                        @click="groupFlightSegments()"
                        style="min-width: 0"
                        color="primary"
                        class="ml-3 mr-3 my-5 px-3 py-4"
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
            flightText:{}
        },
        watch:{
            flightText(val) {
                console.log(val)
                if(val.length>0){
                    this.addFlightSegment(val)
                    // this.flightText.splice(0)
                }
            },
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
            // this.initForm()					
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
                // this.selectedSegments=[]

            },

            getState(){
                return {
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
            },

            addBlankFlightSegment(){
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
                    state:this.getState()
                }
                this.tmpId++;
                this.flightSegments.push(flightSegment)
            },

            addFlightSegment(flights){
                
                for(const flight of flights){
                    
                    const arrivalDate = this.getFlightDate(flight.arrivalDate)
                    const departureDate = this.getFlightDate(flight.departureDate)
                    
                    const  flightSegment= {
                        tmpId:this.tmpId,
                        sortOrder:null,
                        state:this.getState(),

                        flightNumber:this.cleanText(flight.airline + ' ' +flight.flightNumber),
                        departDate:departureDate,
                        departDay:departureDate.toISOString().slice(0,10),
                        departTime:this.cleanText(flight.departureTime),
                        departLocation:this.cleanText(flight.departureAirport+ ' ' +flight.departureAirportCode+' Terminal: '+flight.departureTerminal),
                        arriveDate:arrivalDate,
                        arriveDay:arrivalDate.toISOString().slice(0,10),
                        arriveTime:this.cleanText(flight.arrivalTime),
                        arriveLocation:this.cleanText(flight.arrivalAirport+ ' ' +flight.arrivalAirportCode+' Terminal: '+flight.arrivalTerminal),
                        duration:this.cleanText(flight.duration),
                        status:this.cleanText(flight.status),
                        class:this.cleanText(flight.class),                        
                    }
                    this.tmpId++;
                    this.flightSegments.push(flightSegment)
                }
                this.$emit('cleanPortText')
            },

            cleanText(txt){
                txt=txt.replace('undefined','');
                txt = txt.replace(/\s\s+/g, ' ');
                txt=txt.trim();                
                return txt
            },

            getFlightDate(date){
                const today = new Date()
                const flightDate = this.cleanText(date)
                let fullDate = new Date()
                
                const datePattern = /^(\d{1,2})(\/|\s|-)([A-Za-z]{2,3})(,?)(\/|\s|-)(\d{2}|\d{4})$/;
                const datePatternI = /^(\d{1,2})(\/|\s|-)([A-Za-z]{3})$/;
                const datePatternII = /^([A-Za-z]{3})(\/|\s|-)(\d{1,2})$/;
                
                if(flightDate.match(datePattern)) {
                    fullDate = new Date(flightDate);
                }
                else if(flightDate.match(datePatternI) || flightDate.match(datePatternII)){
                    fullDate = new Date(flightDate+' '+(today.getFullYear()));
                    if(fullDate<today) fullDate = new Date(flightDate+' '+(today.getFullYear()+1));                        
                }
                return (fullDate)
            },

            segmentSelected(event){
                // console.log(event)
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

                for (const key of Object.keys(state)) {
                    if (state[key]){
                        // const delIndex = this.selectedSegments = this.selectedSegments.findIndex(seg => seg.tmpId == item.tmpId);                         
                        // if(delIndex>=0) this.selectedSegments.splice(delIndex,1);
                        return false;
                    }
                }
                return true
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
                        // this.selectedSegments=[];
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

            removeFlightSegments() {
                for(const selectedSegment of this.selectedSegments){
                    const delIndex = this.flightSegments.findIndex(segment => (segment.tmpId == selectedSegment.tmpId));
                    if(delIndex>=0) this.flightSegments.splice(delIndex,1);
                }
                this.selectedSegments.splice(0)
            }
        }
    };
</script>

<style scoped >
    ::v-deep table tbody td {    
        border: 0px solid white !important;
        background-color: #FFFFFF !important;
    }
</style>