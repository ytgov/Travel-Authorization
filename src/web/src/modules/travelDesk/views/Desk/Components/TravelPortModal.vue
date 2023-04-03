<template>
	<div>
		<v-dialog v-model="travelPortDialog" persistent >
			<template v-slot:activator="{ on, attrs }">
				<v-btn					
					size="x-small"
					style="min-width:0;"					
					color="blue"					
					@click="initForm()"
					v-bind="attrs"
					v-on="on">
					<div class="mx-n2 px-2">Travel Port Text</div>		
				</v-btn>
			</template>
			
			<v-card>
				<v-card-title class="primary" style="border-bottom: 1px solid black">
					<div class="text-h5"> 
						Manage Groups/Flight Options						
					</div>
					<v-btn color="grey darken-5" class="my-0 ml-auto px-5" :loading="savingData" @click="closeModal()">						
						<div>Close</div>
					</v-btn>
				</v-card-title>

				<v-card-text>
					<v-row class="mt-5">
						<v-col cols="3">
							<title-card class="mt-5" titleWidth="10rem" largeTitle>
								<template #title>
									<div>Travel Port Text</div>
								</template>										
								<template #body>
									<v-row class="mx-0">																								
										<v-btn
											elevation="5"
											class="mx-auto mt-7 mb-7"
											style="min-width:0;"
											@click="parseTravel()"					
											color="blue">
											<div class="mx-0 px-1">Clean and Seperate Options</div>		
										</v-btn>												
									</v-row>
									<v-textarea
										class="mx-5"								
										:error="state.portTextErr"
										@input="state.portTextErr=false"								
										label="Paste Text Here"
										v-model="portText"
										rows="20"
										clearable		
										outlined/>
								</template>
							</title-card>							
						</v-col>
						<v-col cols="9">
							<title-card class="mt-5" titleWidth="16rem" largeTitle>
								<template #title>
									<div>Cost and Group Segments</div>
								</template>
								<template #body>
									<flight-segments-table 
										:flightSegments="flightSegments"
										:flightOptions="flightOptions"
										:flightText="flightText"
										@cleanPortText="portText='';" 
										class="mx-2 mt-10" />
									<flight-options-table
										:legs="legs" 
										:ungroupedFlightSegments="flightSegments"
										:flightOptions="flightOptions" 
										style="margin: 7rem 0.5rem 2rem 0.5rem;" />
									<v-row class="mx-0">
										<v-btn
											class="ml-3 mr-2 my-5 px-3 py-4"
											style="min-width: 0"
											color="grey darken-1"
											@click="closeModal()"
											:loading="savingData"
											small>Close
										</v-btn>
										<v-btn                
											@click="deleteFlightOptions(true)"
											style="min-width: 0"
											color="red"
											class="ml-3 my-5 px-3 py-4"
											:loading="savingData"
											small>Delete Travel Port Record
										</v-btn>
										<v-btn
											:disabled="flightOptions.length==0"                                       
											@click="removeAllFlightOptions()"
											style="min-width: 0"
											color="secondary"
											class="ml-auto mr-3 my-5 px-3 py-4"
											:loading="savingData"
											small>Remove All Groups
										</v-btn>
										<v-btn 
											:disabled="flightOptions.length==0"                                      
											@click="saveAllFlightOptions()"
											style="min-width: 0"
											color="#005A65"
											class="ml-3 mr-3 my-5 px-3 py-4"
											:loading="savingData"
											small>Save Groupings
										</v-btn>
									</v-row>
								</template>
							</title-card>
						</v-col>
					</v-row>
					
				</v-card-text>
			</v-card>
		</v-dialog>			
	</div>
</template>

<script>
	import Vue from "vue";
	import TitleCard from '../../Common/TitleCard.vue'
	import FlightSegmentsTable from './FlightSegmentsTable.vue'
	import FlightOptionsTable from './FlightOptionsTable.vue'
	import { TRAVEL_DESK_URL } from "../../../../../urls"
	import { securePost, secureDelete } from '../../../../../store/jwt';

	export default {		
		name: "TravelPortModal",
		components: {
			TitleCard,
			FlightSegmentsTable,
			FlightOptionsTable
		},
		props: {
			flightRequests: {},
			requestID: {}
		},
		data() {
			return {
				travelPortDialog: false,				
				readonly: false,
				savingData: false,
				portText:"",
				flightOptions: {},
				flightText:{},
				flightSegments:[],
				state:{
					portTextErr:false
				},
				legs:[]
			};
		},
		mounted() {			
		},
		methods: {			
			initForm(){
				this.flightSegments=[]
				this.flightOptions=[]
				this.legs=[]
				for(const flightRequest of this.flightRequests){
					this.flightOptions.push(...flightRequest.flightOptions)
					// console.log(flightRequest)
					this.legs.push({
						flightRequestID:flightRequest.flightRequestID,
						text:this.getFlightRequestTxt(flightRequest)
					})
				}
				// console.log(this.legs)
			},

			getFlightRequestTxt(flightRequest){
				return(
					flightRequest.departLocation +' -> '+ 
					flightRequest.arriveLocation + ' @ ' +
					Vue.filter('beautifyDate')(flightRequest.date)
				)
			},
			checkStates(){
				let complete=true;
				for(const flightOption of this.flightOptions){
					// console.log(flightOption)
					flightOption.state.costErr = flightOption.cost? false : true
					flightOption.state.legErr = flightOption.flightRequestID? false : true
					if(flightOption.state.costErr || flightOption.state.legErr) complete=false;
				}
				return complete;
			},
		

			deleteFlightOptions(removeSegments){
				this.savingData=true
				secureDelete(`${TRAVEL_DESK_URL}/flight-options/${this.requestID}`)
                    .then(resp => {
						console.log(resp)
						this.flightOptions.splice(0);
						if(removeSegments) this.flightSegments=[]
						this.savingData=false                   
                })
                .catch(e => {
                    console.log(e);
					this.savingData=false
                });                
            },

            removeAllFlightOptions(){
                for(const flightOption of this.flightOptions){
                    for(const flightSegment of flightOption.flightSegments){
                        this.flightSegments.push(flightSegment)						
                    }
                }
                this.flightOptions.splice(0);				
                this.deleteFlightOptions(false);				
            },

            saveAllFlightOptions(){
				if(this.checkStates()){

					this.savingData=true
					const body = this.flightOptions;

					securePost(`${TRAVEL_DESK_URL}/flight-options/${this.requestID}`, body)
						.then(resp => {
							console.log(resp) 
							this.savingData=false 
							this.closeModal()
					})
					.catch(e => {
						console.log(e);
						this.savingData=false
					});
				}
            },

			parseTravel(){
				if(!this.portText) return				
				const parsedTravel = Vue.filter("parseTravel")(this.portText)
				console.log(parsedTravel)
				this.flightText=parsedTravel.flights
				
			},

			closeModal(){
				this.$emit('close')
				this.travelPortDialog=false				
            },
		}
	};
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">
.label {
	font-weight: 600;
	font-size: 10pt !important;
}
</style>