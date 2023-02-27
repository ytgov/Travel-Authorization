<template>
	<div>
		<v-dialog v-model="addNewTravelDialog" persistent >
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					elevation="5"
					style="min-width:0; height:1.75rem;"
					class="my-0 mx-0 px-0"
					color="primary"
					@click="initForm()"
					v-bind="attrs"
					v-on="on"
					>
					<div class="mx-0 px-1"><v-icon style="font-size:15pt;">mdi-pencil</v-icon></div>					
				</v-btn>
			</template>

			<v-card :loading="loadingData" :disabled="loadingData" en>
				<v-card-title class="primary" style="border-bottom: 1px solid black">
					<div class="text-h5">
						Travel Desk Request
					</div>
				</v-card-title>

				<div v-if="loadingData" class="mt-10" style="text-align: center">loading ...</div>
				<v-card-text v-if="!loadingData">
					<v-row class="mb-3">
						<v-col cols="8">										
							<traveler-details 
								:travelerDetails="travelRequest" 
								:travelerState="state" 
								:readonly="true"/>

							<title-card class="mt-5" titleWidth="11rem" largeTitle>
								<template #title>
									<div>Travel Information</div>
								</template>										
								<template #body>
										<!-- <v-row class="mt-3 mb-n5 mr-5">
											<travel-port-modal
												class="my-1 ml-auto"
											/>
										</v-row> -->
									<title-card class="mt-9 mx-5" titleWidth="8rem">
										<template #title>
											<div>Flight Request</div>
										</template>										
										<template #body>
											<v-row class="m-0 p-0">
												<v-col cols="9" class="my-0 mx-0 p-0" >
													<flight-request-table 
														class="mr-n5 mt-n1"
														:readonly="false"
														showFlightOptions 												
														travelDeskUser
														:flightRequests="travelRequest.flightRequests" />
												</v-col>
												<v-col cols="3" >
													<v-textarea
														class="mt-3 ml-0 mr-3"
														:readonly="readonly"
														v-model="travelRequest.additionalInformation"
														label="Additional Information"
														outlined
														rows="10"
														:clearable="!readonly"/>									
												</v-col>
											</v-row>
										</template>
									</title-card>
									<rental-car-request-table 
										:readonly="false"
										:flightRequests="travelRequest.flightRequests" 
										:rentalCars="travelRequest.rentalCars" />
									<hotel-request-table 
										:readonly="false"
										:flightRequests="travelRequest.flightRequests" 
										:hotels="travelRequest.hotels" />
									<transportation-request-table 
										:readonly="false"
										:otherTransportations="travelRequest.otherTransportation" />	
														
									
								</template>
							</title-card>
						</v-col>	 
						<v-col cols="4">
							<v-row class="mt-3 mb-0 mx-0">
								<v-col cols="6"/>
								<v-col cols="6">
									<v-select
										class="mr-2"
										:items="travelDeskAgentList"							
										label="Travel Desk Agent Assigned"
										v-model="travelRequest.travelDeskOfficer"								
										outlined/>		
								</v-col>											
							</v-row>
							<questions-table 
								:readonly="false"
								:questions="travelRequest.questions" />
						</v-col>
					</v-row>
					
				</v-card-text>

				<v-card-actions>
					<v-btn color="grey darken-5" class="px-5" @click="closeDialog">						
						<div>Cancel</div>
					</v-btn>
					<v-btn
						v-if="type"
						class="ml-auto mr-2 px-5"
						color="green darken-1"
						@click="saveNewTravelRequest('save')"
						:loading="savingData">Save Draft
					</v-btn>
					<v-btn
						v-if="type"
						class="mr-5 px-5 "
						color="brown darken-1"
						@click="saveNewTravelRequest('submit')"
						:loading="savingData">Submit
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>	
		
	</div>
</template>

<script>
	import Vue from "vue";	
	import { TRAVEL_DESK_URL } from "../../../../urls";
	import { secureGet } from "@/store/jwt";
	import TitleCard from  '../Common/TitleCard.vue'
	import TravelerDetails from "../Requests/Components/TravelerDetails.vue";
	import FlightRequestTable from "../Requests/RequestDialogs/FlightRequestTable.vue";
	import RentalCarRequestTable from "../Requests/RequestDialogs/RentalCarRequestTable.vue";
	import HotelRequestTable from "../Requests/RequestDialogs/HotelRequestTable.vue";
	import TransportationRequestTable from "../Requests/RequestDialogs/TransportationRequestTable.vue";
	// import TravelPortModal from "./Components/TravelPortModal.vue"

	import QuestionsTable from "./Components/QuestionsTable.vue"
	

	export default {
		components: {
			TitleCard ,
			TravelerDetails,
			FlightRequestTable,
			RentalCarRequestTable,
			TransportationRequestTable,
			HotelRequestTable,
			QuestionsTable,
			// TravelPortModal
		},
		name: "NewTravelDeskRequest",
		props: {
			type: {
				type: String
			},
			travelDetail: {}
		},
		data() {
			return {					
				
				addNewTravelDialog: false,				
				readonly: false,
				internationalTravel: false,
				travelDeskAgentList: [],				
				travelerDetails: {},
				savingData: false,
				travelRequest: {},

				state: {					
					flightRequestsErr: false,					
					rentalCarsErr: false,
					hotelsErr: false,
					otherTransportationErr: false
				},

				differentTravelContactHint: "",
				loadingData: false				
			};
		},
		mounted() {						
		},
		methods: {
			updateTable() {
				this.$emit("updateTable");
			},

			async initForm() {
				// this.initStates();
				this.savingData = false;
				this.loadingData = true;
				const taid = this.travelDetail.TAID
				this.travelRequest = await this.getTravelRequestInfo(taid)

				const agents=this.$store.state.traveldesk.travelDeskUsers;
				this.travelDeskAgentList=agents.map(agent => agent.first_name+' '+agent.last_name);
				if(!this.travelRequest.travelDeskOfficer){
					const usrEmail = this.$store.state.auth.user.email
					const currentUser = agents.filter(agent => agent.email==usrEmail)[0]
					if(currentUser)
						this.travelRequest.travelDeskOfficer=currentUser.first_name+' '+currentUser.last_name
				}
				Vue.nextTick(()=>this.loadingData = false)				
			},	
			closeDialog(){
				this.updateTable()
				this.addNewTravelDialog = false
			},

			async getTravelRequestInfo(taid) {				
				return secureGet(`${TRAVEL_DESK_URL}/travel-request/`+taid)
					.then(resp => {
						// console.log(resp.data)						
						return(resp.data)
					})
					.catch(e => {
						console.log(e);
					});
			},

			

			// extractTravelRequestInfo(travelerDetails){
			// 	travelerDetails.internationalTravel= (travelerDetails.passportCountry || travelerDetails.passportNum)
			// 	travelerDetails.office="";
			// 	travelerDetails.department= this.$store.state.auth.department;
			// 	travelerDetails.fullName= travelerDetails.legalFirstName+'.'+travelerDetails.legalLastName;
			// 	this.travelerDetails = travelerDetails;
			// 	this.loadingData = false;
			// },
			

			// saveNewTravelRequest(saveType) {
			// 	console.log(saveType)
			// 	console.log(this.travelerDetails)

			// 	if (this.checkFields()) {
			// 		this.savingData = true;
			// 		const body = this.travelerDetails
			// 		delete body.internationalTravel;
			// 		delete body.differentTravelContact
			// 		delete body.office
			// 		delete body.department
			// 		delete body.fullName
			// 		// console.log(body);
			// 		const id = this.authorizedTravel.id
			// 		securePost(`${TRAVEL_DESK_URL}/travel-request/${id}`, body)
			// 		.then(() => {
			// 			this.savingData = false;
			// 			this.addNewTravelDialog = false;
			// 			this.$emit("updateTable");
			// 		})
			// 		.catch(e => {
			// 			this.savingData = false;
			// 			console.log(e);
			// 		});
			// 	}
			// },

			// initStates() {
				
			// 	this.differentTravelContactHint = "";
			// 	for (const key of Object.keys(this.state)) {
			// 		this.state[key] = false;
			// 	}
			// },
			
			// checkFields() {

			// 	this.state.firstNameErr = this.travelerDetails.legalFirstName? false:true;
			// 	this.state.middleNameErr = false,
			// 	this.state.lastNameErr = this.travelerDetails.legalLastName? false:true;
			// 	this.state.birthDateErr = this.travelerDetails.birthDate? false:true;
			// 	this.state.travelAuthErr = false; //this.travelerDetails.travelAuth? false:true; TODO: add this in backend
			// 	this.state.addressErr = this.travelerDetails.strAddress? false:true;
			// 	this.state.cityErr = this.travelerDetails.city? false:true;
			// 	this.state.provinceErr = this.travelerDetails.province? false:true;
			// 	this.state.postalCodeErr = this.travelerDetails.postalCode? false:true;
			// 	this.state.passportNumberErr = this.internationalTravel && !this.travelerDetails.passportNum? true: false;
			// 	this.state.passportCountryErr = this.internationalTravel && !this.travelerDetails.passportCountry? true: false;
			// 	this.state.businessPhoneErr = this.travelerDetails.busPhone? false:true;
			// 	this.state.businessEmailErr = this.travelerDetails.busEmail? false:true;
			// 	this.state.travelPhoneErr = this.travelerDetails.travelContact && !this.travelerDetails.travelPhone? true: false;//show hint
			// 	this.state.travelEmailErr = this.travelerDetails.travelContact && !this.travelerDetails.travelEmail? true: false;//show hint
			// 	this.state.flightRequestsErr = false;					
			// 	this.state.rentalCarsErr = false;
			// 	this.state.hotelsErr = false;
			// 	this.state.otherTransportationErr = false;				

			// 	for (const key of Object.keys(this.state)) {
			// 		if (this.state[key]) return false;
			// 	}
			// 	return true;
			// },
			
		}
	};
</script>

<style scoped >
	

</style>