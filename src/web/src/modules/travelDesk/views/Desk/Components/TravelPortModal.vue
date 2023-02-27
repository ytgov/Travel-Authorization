<template>
	<div>
		<v-dialog v-model="travelPortDialog" persistent >
			<template v-slot:activator="{ on, attrs }">
				<v-btn					
					size="x-small"
					style="min-width:0; height:2rem; font-size:8pt;"					
					color="blue"					
					@click="initForm()"
					v-bind="attrs"
					v-on="on">
					<div class="mx-n2 px-0"><b>Travel Port Text</b></div>		
				</v-btn>
			</template>
			
					<v-card>
						<v-card-title class="primary" style="border-bottom: 1px solid black">
							<div class="text-h5">
								<span class="text-h6">Manage options for flight from </span>
								<b class="amber--text" >{{flightRequest.departLocation}}</b>								
								<span class="text-h6"> to </span> <b class="amber--text">{{flightRequest.arriveLocation}}</b>
								<span class="text-h6"> on </span> <b class="amber--text">{{flightRequest.date | beautifyDate}}</b>
								<b class="ml-5 text-h6">({{flightRequest.timePreference}}/{{flightRequest.seatPreference}})</b>
							</div>
							<v-btn color="grey darken-5" class="my-0  ml-auto px-5" :loading="savingData" @click="travelPortDialog=false">						
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
												rows="30"
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
												class="mx-2 mt-10 mb-3" />
											<flight-options-table 
												:ungroupedFlightSegments="flightSegments"
												:flightOptions="flightOptions" 
												class="mx-2 mt-13 mb-3" />
											<v-row class="mx-0">
												<v-btn
													class="ml-3 mr-2 my-5 px-3 py-4"
													style="min-width: 0"
													color="grey darken-1"
													@click="travelPortDialog=false;"
													:loading="savingData"
													small>Close
												</v-btn>
												<v-btn                
													@click="deleteFlightOptions()"
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
													color="warning"
													class="ml-auto mr-3 my-5 px-3 py-4"
													:loading="savingData"
													small>Remove All Groups
												</v-btn>
												<v-btn 
													:disabled="flightOptions.length==0"                                      
													@click="saveAllFlightOptions()"
													style="min-width: 0"
													color="success"
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

						<v-card-actions>
							<!-- <v-btn color="grey darken-5" class="px-5" @click="travelPortDialog=false">						
								<div>Cancel</div>
							</v-btn> -->
							<!-- <v-btn
								class="ml-auto mr-2 px-5"
								color="green darken-1"
								@click="saveNewTravelRequest('save')"
								:loading="savingData">Save Draft
							</v-btn>
							<v-btn								
								class="mr-5 px-5 "
								color="brown darken-1"
								@click="saveNewTravelRequest('submit')"
								:loading="savingData">Submit
							</v-btn> -->
						</v-card-actions>
					</v-card>
				
					
				
		</v-dialog>	
		
	</div>
</template>

<script>
	// import Vue from "vue";
	import TitleCard from '../../Common/TitleCard.vue'
	import FlightSegmentsTable from './FlightSegmentsTable.vue'
	import FlightOptionsTable from './FlightOptionsTable.vue'
	import { TRAVEL_DESK_URL } from "../../../../../urls"
	import { secureDelete, securePost } from '../../../../../store/jwt';

	export default {		
		name: "TravelPortModal",
		components: {
			TitleCard,
			FlightSegmentsTable,
			FlightOptionsTable
		},
		props: {			
			flightOptions: {},
			flightRequest: {}			
		},
		data() {
			return {
				travelPortDialog: false,				
				readonly: false,
				savingData: false,
				portText:"",
				flightSegments:[],
				state:{
					portTextErr:false
				}
			};
		},
		mounted() {			
		},
		methods: {			
			initForm(){
				//
			},

			checkStates(){
				let complete=true;
				for(const flightOption of this.flightOptions){
					// console.log(flightOption)
					flightOption.state.costErr = flightOption.cost? false : true
					if(flightOption.state.costErr) complete=false;
				}
				return complete;
			},

			async deleteFlightOptions(){
				this.savingData=true
				const flightRequestId=this.flightRequest.flightRequestID
				secureDelete(`${TRAVEL_DESK_URL}/flight-options/${flightRequestId}`)
                    .then(resp => {
						console.log(resp) 
						this.savingData=false                   
                })
                .catch(e => {
                    console.log(e);
					this.savingData=false
                });
                
            },

            async removeAllFlightOptions(){
				this.savingData=true
                for(const flightOption of this.flightOptions){
                    for(const flightSegment of flightOption.flightSegments){
                        this.flightSegments.push(flightSegment)
                    }
                }
                this.flightOptions.splice(0);
                await this.deleteFlightOptions();				
            },

            saveAllFlightOptions(){
				if(this.checkStates()){
					this.savingData=true

					const flightRequestId=this.flightRequest.flightRequestID
					const body = this.flightOptions;

					securePost(`${TRAVEL_DESK_URL}/flight-options/${flightRequestId}`, body)
						.then(resp => {
							console.log(resp) 
							this.savingData=false 
							this.travelPortDialog=false              
					})
					.catch(e => {
						console.log(e);
						this.savingData=false
					});
				}
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