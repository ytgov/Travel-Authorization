<template>
	<div>
		<v-dialog v-model="addNewTravelDialog" persistent >
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					elevation="5"
					style="width: 80%"
					class="mr-5 my-2"
					color="primary"
					@click="initForm()"
					v-bind="attrs"
					v-on="on"
					>
					<div v-if="type == 'Submit'">Submit Travel Desk Request</div>
					<div v-else-if="type == 'Review'">Review Travel Options</div>					
				</v-btn>
			</template>

			<v-card>
				<v-card-title class="primary" style="border-bottom: 1px solid black">
					<div class="text-h5">
						Travel Desk Request
					</div>
				</v-card-title>

				<v-card-text>					
				
					<traveler-details 
						:travelerDetails="travelerDetails" 
						:travelerState="state" 
						:readonly="false"/>
					
					<div id="travel-detail">Travel Information</div>
					<v-card elevation="2" outlined>

						<div id="flight-request">Flight Request</div>
						<v-card class="mx-5 my-5" elevation="1" outlined>
							<v-row class="mt-5 mx-3">
								<v-col cols="8">
									<flight-request-table 
										:readonly="false" 
										:flightRequests="travelerDetails.flightRequests" />
								</v-col>
								<v-col cols="4">
									<v-textarea
										:readonly="readonly"
										v-model="travelerDetails.additionalInformation"
										label="Additional Information"
										outlined
										:clearable="!readonly"/>									
								</v-col>
							</v-row>
						</v-card>
						<rental-car-request-table 
							:readonly="false" 
							:rentalCars="travelerDetails.rentalCars" />
						<hotel-request-table 
							:readonly="false" 
							:hotels="travelerDetails.hotels" />
						<transportation-request-table 
							:readonly="false" 
							:otherTransportations="travelerDetails.otherTransportation" />						
					</v-card>	
					
				</v-card-text>

				<v-card-actions>
					<v-btn color="grey darken-5" class="px-5" @click="addNewTravelDialog = false">
						<div v-if="!type">Close</div>
						<div v-else>Cancel</div>
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
	import { LOOKUP_URL, TRAVEL_DESK_URL } from "../../../../urls";
	import { secureGet, securePost } from "@/store/jwt";
	import TravelerDetails from "./Components/TravelerDetails.vue";
	import FlightRequestTable from "./RequestDialogs/FlightRequestTable.vue";
	import RentalCarRequestTable from "./RequestDialogs/RentalCarRequestTable.vue";
	import HotelRequestTable from "./RequestDialogs/HotelRequestTable.vue";
	import TransportationRequestTable from "./RequestDialogs/TransportationRequestTable.vue";
	

	export default {
		components: {
			TravelerDetails,
			FlightRequestTable,
			RentalCarRequestTable,
			TransportationRequestTable,
			HotelRequestTable
		},
		name: "NewTravelDeskRequest",
		props: {
			type: {
				type: String
			},
			authorizedTravel: {}
		},
		data() {
			return {					
				
				addNewTravelDialog: false,				
				readonly: false,
				internationalTravel: false,				
				
				travelerDetails: {},
				savingData: false,

				state: {
					firstNameErr: false,
					middleNameErr: false,
					lastNameErr: false,
					birthDateErr: false,
					travelAuthErr: false,
					addressErr: false,
					cityErr: false,
					provinceErr: false,
					postalCodeErr: false,
					passportNumberErr: false,
					passportCountryErr: false,
					businessPhoneErr: false,
					businessEmailErr: false,
					travelPhoneErr: false,
					travelEmailErr: false,
					flightRequestsErr: false,					
					rentalCarsErr: false,
					hotelsErr: false,
					otherTransportationErr: false
				},

				differentTravelContactHint: ""				
			};
		},
		mounted() {						
		},
		methods: {
			updateTable() {
				this.$emit("updateTable");
			},

			async initForm() {
				this.initStates();
				this.savingData = false;
				const travelRequest = await this.getTravelRequestInfo()
				console.log(travelRequest)
				if(travelRequest?.length>0){
					this.extractTravelRequestInfo(travelRequest[0])
				}else
					await this.getEmployeeInfo()
			},

			async getTravelRequestInfo() {				
				return secureGet(`${TRAVEL_DESK_URL}/travel-request/`+this.authorizedTravel.id)
					.then(resp => {
						console.log(resp.data)						
						return(resp.data)
					})
					.catch(e => {
						console.log(e);
					});
			},

			async getEmployeeInfo() {				
				return secureGet(`${LOOKUP_URL}/employee-info?email=`+this.authorizedTravel.email)
					.then(resp => {
						console.log(resp.data)						
						const employee = resp.data
						const travelerDetails={
							legalFirstName: employee.firstName,
							legalMiddleName: "",
							legalLastName: employee.lastName,
							birthDate: "",
							strAddress: employee.address,
							city: employee.community,
							province: employee.community?.toLowerCase()=='whitehorse'? "Yukon": "",
							postalCode: employee.postalCode,
							passportCountry: "",
							passportNum: "",
							travelPurpose: "",
							travelLocation: "",
							travelNotes: "",							
							busPhone: employee.businessPhone, 
							busEmail: employee.email,
							travelContact:false,
							travelPhone: employee.mobile,
							travelEmail: "",

							internationalTravel:false,							
							office: employee.office,
							department: employee.department,
							fullName: employee.fullName,
							TAID: this.authorizedTravel.id,
							additionalInformation: "",
							rentalCars: [],
							flightRequests: [],
							hotels: [],
							otherTransportation: [],
						}
						this.travelerDetails = travelerDetails
					})
					.catch(e => {
						console.log(e);
					});
			},

			extractTravelRequestInfo(travelerDetails){
				travelerDetails.internationalTravel= (travelerDetails.passportCountry || travelerDetails.passportNum)
				travelerDetails.office="";
				travelerDetails.department= this.$store.state.auth.department;
				travelerDetails.fullName= travelerDetails.legalFirstName+'.'+travelerDetails.legalLastName;
				this.travelerDetails = travelerDetails;
			},
			

			saveNewTravelRequest(saveType) {
				console.log(saveType)
				console.log(this.travelerDetails)

				if (this.checkFields()) {
					this.savingData = true;
					const body = this.travelerDetails
					delete body.internationalTravel;
					delete body.differentTravelContact
					delete body.office
					delete body.department
					delete body.fullName
					// console.log(body);
					const id = this.authorizedTravel.id
					securePost(`${TRAVEL_DESK_URL}/travel-request/${id}`, body)
					.then(() => {
						this.savingData = false;
						this.addNewTravelDialog = false;
						this.$emit("updateTable");
					})
					.catch(e => {
						this.savingData = false;
						console.log(e);
					});
				}
			},

			initStates() {
				
				this.differentTravelContactHint = "";
				for (const key of Object.keys(this.state)) {
					this.state[key] = false;
				}
			},
			
			checkFields() {

				this.state.firstNameErr = this.travelerDetails.legalFirstName? false:true;
				this.state.middleNameErr = false,
				this.state.lastNameErr = this.travelerDetails.legalLastName? false:true;
				this.state.birthDateErr = this.travelerDetails.birthDate? false:true;
				this.state.travelAuthErr = false; //this.travelerDetails.travelAuth? false:true; TODO: add this in backend
				this.state.addressErr = this.travelerDetails.strAddress? false:true;
				this.state.cityErr = this.travelerDetails.city? false:true;
				this.state.provinceErr = this.travelerDetails.province? false:true;
				this.state.postalCodeErr = this.travelerDetails.postalCode? false:true;
				this.state.passportNumberErr = this.internationalTravel && !this.travelerDetails.passportNum? true: false;
				this.state.passportCountryErr = this.internationalTravel && !this.travelerDetails.passportCountry? true: false;
				this.state.businessPhoneErr = this.travelerDetails.busPhone? false:true;
				this.state.businessEmailErr = this.travelerDetails.busEmail? false:true;
				this.state.travelPhoneErr = this.travelerDetails.travelContact && !this.travelerDetails.travelPhone? true: false;//show hint
				this.state.travelEmailErr = this.travelerDetails.travelContact && !this.travelerDetails.travelEmail? true: false;//show hint
				this.state.flightRequestsErr = false;					
				this.state.rentalCarsErr = false;
				this.state.hotelsErr = false;
				this.state.otherTransportationErr = false;				

				for (const key of Object.keys(this.state)) {
					if (this.state[key]) return false;
				}
				return true;
			},
			
		}
	};
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">

</style>