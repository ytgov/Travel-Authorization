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

					<!-- TODO REMOVE -->
					<!-- <div class="mt-3">{{authorizedTravel}}</div>  -->
				
					<traveler-details :travelerDetails="travelerDetails" :readonly="false"/>
					
					<div id="travel-detail">Travel Information</div>
					<v-card elevation="2" outlined>

						<div id="flight-request">Flight Request</div>
						<v-card class="mx-5 my-5" elevation="1" outlined>
							<v-row class="mt-5 mx-3">
								<v-col cols="8">
									<flight-request-table :readonly="false" :flightRequests="travelerDetails.flightRequests" />

								</v-col>
								<v-col cols="4">
									<v-textarea
										:readonly="readonly"
										v-model="travelerDetails.additionalInformation"
										label="Additional Information"
										outlined
										:clearable="!readonly"
									/>									
								</v-col>
							</v-row>
						</v-card>
						<rental-car-request-table :readonly="false" :rentalCars="travelerDetails.rentalCars" />
						<hotel-request-table :readonly="false" :hotels="travelerDetails.hotels" />
						<transportation-request-table :readonly="false" :otherTransportations="travelerDetails.otherTransportation" />
						
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
	// import Vue from "vue";
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
				flights: [
					{departLocation: 'Whitehorse', arriveLocation: 'Toronto', date: '22-08-2022', preferences: 'AM'}
				],

				// ,
				// otherTransport: [
				// 	{type: 'Shuttle', departLocation: 'Missisauga', arriveLocation: 'Toronto', date: '22-08-2022', additionalInfo: 'shuttle from airport to downtown'}
				// ],
			
					
				monthList: [
					"January",
					"February",
					"March",
					"April",
					"May",
					"June",
					"July",
					"August",
					"September",
					"October",
					"November",
					"December"
				],
				addNewTravelDialog: false,
				adNameList: [],
				adName: "",				
				loadingData: false,
				showApproval: false,
				approved: false,
				approvedBy: "",
				approvalDate: "",
				readonly: false,
				internationalTravel: false,				
				admin: false,



				travelerDetails: {},
				savingData: false,

				state: {
					purposeErr: false,
					costErr: false,
					locationErr: false,
					departmentErr: false,
					branchErr: false,
					anticipatedMonthErr: false,
					travellerNumErr: false,
					startDateErr: false,
					endDateErr: false,
					unknownDateErr: false,
					differentTravelContactErr: false
				},

				adNameErr: false
			};
		},
		mounted() {						
		},
		methods: {
			// updateTable() {
			// 	this.$emit("updateTable");
			// },

			async initForm() {
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

				// if (this.checkFields()) {
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
						// this.addNewTravelDialog = false;
						// this.$emit("updateTable");
					})
					.catch(e => {
						this.savingData = false;
						console.log(e);
					});
				// }
			},
			

			// initStates() {
			// 	this.adNameErr = false;
			// 	this.differentTravelContactHint = "";
			// 	for (const key of Object.keys(this.state)) {
			// 		this.state[key] = false;
			// 	}
			// },			

			// initDepartments() {
			// 	this.departmentList = [];
			// 	const depts = this.$store.state.preapproved.departmentBranch;
			// 	for (const key of Object.keys(depts)) {
			// 		this.departmentList.push({
			// 		name: key
			// 		});
			// 	}
			// },

			// initSubmission(id) {
			// 	secureGet(`${PREAPPROVED_URL}/submissions/${id}`)
			// 		.then(res => {
			// 			this.showApproval = res.data.status == "Finished";
			// 			this.approvedBy = res.data.approvedBy;
			// 			this.approvalDate = res.data.approvalDate;
			// 		})
			// 		.catch(e => {
			// 			console.log(e);
			// 		});
			// },

			// downloadPdf() {
			// 	this.loadingData = true;
			// 	const header = {
			// 		responseType: "application/pdf",
			// 		headers: {
			// 			"Content-Type": "application/text"
			// 		}
			// 	};

			// 	secureGet(`${PREAPPROVED_URL}/document/${this.travelRequest.preTSubID}`, header)
			// 		.then(res => {
			// 			this.loadingData = false;
			// 			const link = document.createElement("a");
			// 			link.href = res.data;
			// 			document.body.appendChild(link);
			// 			link.download = this.approved ? "approval_doc.pdf" : "doc.pdf";
			// 			link.click();
			// 			setTimeout(() => URL.revokeObjectURL(link.href), 1000);
			// 		})
			// 		.catch(e => {
			// 			this.loadingData = false;
			// 			console.log(e);
			// 		});
			// },

			

			// departmentChanged(branch) {
			// 	this.state.departmentErr = false;
			// 	this.branch = branch ? branch : "";
			// 	const depts = this.$store.state.preapproved.departmentBranch;
			// 	if (this.department) {
			// 		this.branchList = depts[this.department].branches;
			// 	} else {
			// 		this.branchList = [];
			// 	}
			// },

			// editFlight(item) {
			// 	this.travellers = this.travellers.filter(
			// 		traveller => !(traveller.fullName == item.fullName && traveller.department == item.department)
			// 	);
			// 	if (this.travellers.length == 0 && this.differentTravelContact) {
			// 		this.travellersNum = null;
			// 	}
			// },

			// removeFlight(item) {
			// 	this.travellers = this.travellers.filter(
			// 		traveller => !(traveller.fullName == item.fullName && traveller.department == item.department)
			// 	);
			// 	if (this.travellers.length == 0 && this.differentTravelContact) {
			// 		this.travellersNum = null;
			// 	}
			// }
		}
	};
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">

</style>