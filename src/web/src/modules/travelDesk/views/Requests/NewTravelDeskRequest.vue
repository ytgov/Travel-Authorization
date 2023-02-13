<template>
	<div>
		<v-dialog v-model="addNewTravelDialog" persistent >
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					elevation="5"
					style="width: 80%"
					class="mr-5 my-7"
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

					<div id="traveller-detail">Traveller Details</div>
					<v-card elevation="2" outlined>
						<v-row class="mt-5 mx-3">
							<v-col cols="2">
								<v-text-field
									:readonly="readonly"								
									:error="state.firstNameErr"
									label="Legal First Name"
									v-model="firstName"								
									outlined/>
							</v-col>
							<v-col cols="2">
								<v-text-field
									:readonly="readonly"								
									:error="state.middleNameErr"
									label="Legal Middle Name"
									v-model="middleName"								
									outlined/>
							</v-col>
							<v-col cols="2">
								<v-text-field
									:readonly="readonly"								
									:error="state.lastNameErr"
									label="Legal Last Name"
									v-model="lastName"								
									outlined/>
							</v-col>
							<v-col cols="4">
								<v-text-field
								:readonly="readonly"
								:error="state.dobErr"
								v-model="dob"
								@input="state.unknownDateErr = false"
								label="Birth Date"
								outlined
								type="date"/>
							</v-col>
							<v-col cols="2">
								<v-text-field
									:readonly="readonly"								
									:error="state.travelAuthErr"
									label="Travel Auth"
									v-model="travelAuth"								
									outlined/>
							</v-col>						
						</v-row>
						<v-row class="mt-0 mx-3">
							<v-col cols="4">
								<v-text-field
									:readonly="readonly"								
									:error="state.addressErr"
									label="Address"
									v-model="address"								
									outlined/>
							</v-col>
							<v-col cols="2">
								<v-text-field
									:readonly="readonly"								
									:error="state.cityErr"
									label="City"
									v-model="city"								
									outlined/>
							</v-col>
							<v-col cols="2">
								<v-text-field
									:readonly="readonly"								
									:error="state.provinceErr"
									label="Province"
									v-model="province"								
									outlined/>
							</v-col>
							<v-col cols="2">
								<v-text-field
									:readonly="readonly"								
									:error="state.postalCodeErr"
									label="Postal Code"
									v-model="postalCode"								
									outlined/>
							</v-col>
							<v-col cols="2">
								<v-text-field
									v-if="internationalTravel"
									:readonly="readonly"								
									:error="state.passportNumberErr"
									label="Passport Number"
									v-model="passportNumber"								
									outlined/>
							</v-col>						
						</v-row>

						<v-row class="mt-0 mx-3">
							<v-col cols="4">
								<v-text-field
									:readonly="readonly"								
									:error="state.businessPhoneErr"									
									label="Business Phone"
									v-model="businessPhone"								
									outlined/>
							</v-col>
							<v-col cols="4">
								<v-text-field
									:readonly="readonly"								
									:error="state.businessEmailErr"									
									label="Business Email"
									v-model="businessEmail"								
									outlined/>
							</v-col>
							<v-col cols="4">
								<v-checkbox
								:readonly="readonly"
								:error-messages="
									state.differentTravelContactErr
									? `Either add Travelers' name below or Select this option`
									: differentTravelContactHint
									? differentTravelContactHint
									: ''
								"
								@change="selectDifferentTravelContact()"
								v-model="differentTravelContact"
								label="Contact information different for travel"
								/>
							</v-col>
							
						</v-row>
					</v-card>

					<div id="travel-detail">Travel Information</div>
					<v-card elevation="2" outlined>

						<div id="flight-request">Flight Request</div>
						<v-card class="mx-5 my-5" elevation="1" outlined>
							<v-row class="mt-5 mx-3">
								<v-col cols="8">
									<v-data-table :headers="flightHeaders" :items="flights" hide-default-footer class="elevation-1">
										<template v-slot:[`item.edit`]="{ item }">
											<v-btn
												v-if="!readonly"
												@click="editFlight(item)"
												style="min-width: 0"
												color="transparent"
												class="px-1"
												small><v-icon class="" color="blue">mdi-pencil</v-icon>
											</v-btn>
											<v-btn
												v-if="!readonly"
												@click="removeFlight(item)"
												style="min-width: 0"
												color="transparent"
												class="px-1"
												small><v-icon class="" color="red">mdi-account-remove</v-icon>
											</v-btn>
										</template>
									</v-data-table>
								</v-col>
								<v-col cols="4">
									<v-textarea
										:readonly="readonly"
										v-model="additionalInformation"
										label="Additional Information"
										outlined
										:clearable="!readonly"
									/>									
								</v-col>
							</v-row>
						</v-card>

						<div id="car-rental-request">Rental Car Request</div>
						<v-card class="mx-5 my-5" elevation="2" outlined>
							<v-row class="mt-3 mx-3">
								<new-rental-car-request
									type="Add New"
									@updateTable="updateTable"
									:carRequest="item"/>								
							</v-row>
							<v-row class="mb-3 mx-3">
								<v-col cols="12">
									<v-data-table :headers="rentalCarHeaders" :items="rentalCars" hide-default-footer class="elevation-1">
										<template v-slot:[`item.edit`]="{ item }">
											<v-btn
												v-if="!readonly"
												@click="editRentalCar(item)"
												style="min-width: 0"
												color="transparent"
												class="px-1"
												small><v-icon class="" color="blue">mdi-pencil</v-icon>
											</v-btn>
											<v-btn
												v-if="!readonly"
												@click="removeRentalCar(item)"
												style="min-width: 0"
												color="transparent"
												class="px-1"
												small><v-icon class="" color="red">mdi-account-remove</v-icon>
											</v-btn>
										</template>
									</v-data-table>
								</v-col>								
							</v-row>
						</v-card>

						<div id="hotel-request">Hotel Request</div>
						<v-card class="mx-5 my-5" elevation="2" outlined>
							<v-row class="mt-0 mx-3">
								<new-hotel-request
									type="Add New"
									@updateTable="updateTable"
									:transportationRequest="item"/>
							</v-row>
							<v-row class="mb-3 mx-3">
								<v-col cols="12">
									<v-data-table :headers="hotelHeaders" :items="hotels" hide-default-footer class="elevation-1">
										<template v-slot:[`item.edit`]="{ item }">
											<v-btn
												v-if="!readonly"
												@click="editHotel(item)"
												style="min-width: 0"
												color="transparent"
												class="px-1"
												small><v-icon class="" color="blue">mdi-pencil</v-icon>
											</v-btn>
											<v-btn
												v-if="!readonly"
												@click="removeHotel(item)"
												style="min-width: 0"
												color="transparent"
												class="px-1"
												small><v-icon class="" color="red">mdi-account-remove</v-icon>
											</v-btn>
										</template>
									</v-data-table>
								</v-col>								
							</v-row>
						</v-card>

						<div id="other-transportation-request">Other Transportation Request</div>
						<v-card class="mx-5 my-5" elevation="2" outlined>
							<v-row class="mt-0 mx-3">
								<new-transportation-request
									type="Add New"
									@updateTable="updateTable"
									:transportationRequest="item"/>
							</v-row>
							<v-row class="mb-3 mx-3">
								<v-col cols="12">
									<v-data-table :headers="otherTransportHeaders" :items="otherTransport" hide-default-footer class="elevation-1">
										<template v-slot:[`item.edit`]="{ item }">
											<v-btn
												v-if="!readonly"
												@click="editOtherTransport(item)"
												style="min-width: 0"
												color="transparent"
												class="px-1"
												small><v-icon class="" color="blue">mdi-pencil</v-icon>
											</v-btn>
											<v-btn
												v-if="!readonly"
												@click="removeOtherTransport(item)"
												style="min-width: 0"
												color="transparent"
												class="px-1"
												small><v-icon class="" color="red">mdi-account-remove</v-icon>
											</v-btn>
										</template>
									</v-data-table>
								</v-col>								
							</v-row>
						</v-card>

					</v-card>	
					
				</v-card-text>

				<v-card-actions>
					<v-btn color="grey darken-5" @click="addNewTravelDialog = false">
						<div v-if="type == 'View'">Close</div>
						<div v-else>Cancel</div>
					</v-btn>
					<v-btn
						v-if="type == 'Edit' && admin"
						class="ml-5"
						color="red darken-5"
						@click="deleteDialog = true"
						:loading="savingData">Delete
					</v-btn>
					<v-btn
						v-if="type == 'Add New' || type == 'Edit'"
						class="ml-auto"
						color="green darken-1"
						@click="saveNewTravelRequest()"
						:loading="savingData">Save
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>		

		<v-dialog v-model="deleteDialog" persistent max-width="400px">
			<v-card>
				<v-card-title class="amber accent-2" style="border-bottom: 1px solid black">
				<div class="text-h5">Delete Travel Request</div>
				</v-card-title>

				<v-card-text> </v-card-text>

				<v-card-actions>
				<v-btn color="grey darken-5" @click="deleteDialog = false"> Cancel </v-btn>
				<v-btn class="ml-auto" color="red darken-1" @click="deleteTravelRequest()"> Delete </v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	import Vue from "vue";
	import { PREAPPROVED_URL } from "../../../../urls";
	import { secureDelete, secureGet, securePost } from "@/store/jwt";
	import NewRentalCarRequest from "./RequestDialogs/NewRentalCarRequest.vue";
	import NewTransportationRequest from "./RequestDialogs/NewTransportationRequest.vue";
	import NewHotelRequest from "./RequestDialogs/NewHotelRequest.vue";

	export default {
		components: {
			NewRentalCarRequest,
			NewTransportationRequest,
			NewHotelRequest
		},
		name: "NewTravelDeskRequest",
		props: {
			type: {
			type: String
			},
			travelRequest: {}
		},
		data() {
			return {
				flightHeaders: [
					{
						text: "Depart Location",
						value: "departLocation",
						class: "blue-grey lighten-4"
					},
					{
						text: "Arrive Location",
						value: "arriveLocation",
						class: "blue-grey lighten-4"
					},
					{
						text: "Date",
						value: "date",
						class: "blue-grey lighten-4"
					},
					{
						text: "Preferences",
						value: "preferences",
						class: "blue-grey lighten-4"
					},
					{
						text: "",
						value: "edit",
						class: "blue-grey lighten-4",
						cellClass: "px-0 mx-0",
						sortable: false
					}
				],
				flights: [
					{departLocation: 'Whitehorse', arriveLocation: 'Toronto', date: '22-08-2022', preferences: 'AM'}
				],

				rentalCarHeaders: [
					{
						text: "Match Flight Times",
						value: "matchFlightTimes",
						class: "blue-grey lighten-4"
					},
					{
						text: "Pick-up Location",
						value: "pickupLocation",
						class: "blue-grey lighten-4"
					},
					{
						text: "Drop-off Location",
						value: "dropoffLocation",
						class: "blue-grey lighten-4"
					},
					{
						text: "Pick-up Date",
						value: "pickupDate",
						class: "blue-grey lighten-4"
					},
					{
						text: "Drop-off Date",
						value: "dropoffDate",
						class: "blue-grey lighten-4"
					},
					{
						text: "Location",
						value: "location",
						class: "blue-grey lighten-4"
					},
					{
						text: "Vehicle Type",
						value: "vehicleType",
						class: "blue-grey lighten-4"
					},
					{
						text: "Reason Change",
						value: "reasonChange",
						class: "blue-grey lighten-4"
					},
					{
						text: "Additional Information",
						value: "additionalInformation",
						class: "blue-grey lighten-4"
					},
					{
						text: "",
						value: "edit",
						class: "blue-grey lighten-4",
						cellClass: "px-0 mx-0",
						sortable: false
					}
				],
				rentalCars: [
					{
						matchFlightTimes: 'No',
						pickupLocation: 'Toronto',
						dropoffLocation: 'Toronto',
						pickupDate: '22-08-2022 10:00',
						dropoffDate: '29-08-2022 17:00', 
						location: 'Airport', 
						vehicleType: 'SUV',
						reasonChange: '22-08-2022', 
						additionalInformation: 'info ...'
					}
				],

				hotelHeaders: [
					{
						text: "Check-in",
						value: "checkIn",
						class: "blue-grey lighten-4"
					},
					{
						text: "Check-out",
						value: "checkOut",
						class: "blue-grey lighten-4"
					},
					{
						text: "City",
						value: "city",
						class: "blue-grey lighten-4"
					},
					{
						text: "Conference/Meeting Name",
						value: "meetingName",
						class: "blue-grey lighten-4"
					},
					{
						text: "Conference/Meeting Hotel",
						value: "meetingHotel",
						class: "blue-grey lighten-4"
					},
					{
						text: "Additional Information",
						value: "additionalInfo",
						class: "blue-grey lighten-4"
					},
					{
						text: "",
						value: "edit",
						class: "blue-grey lighten-4",
						cellClass: "px-0 mx-0",
						sortable: false
					}
				],
				hotels: [
					{checkIn: '22-08-2022', checkOut: '22-08-2022', city: 'Toronto', meetingName: '22-08-2022', meetingHotel: '22-08-2022', additionalInfo: 'Info ...'}
				],

				otherTransportHeaders: [
					{
						text: "Type",
						value: "type",
						class: "blue-grey lighten-4"
					},
					{
						text: "Depart Location",
						value: "departLocation",
						class: "blue-grey lighten-4"
					},
					{
						text: "Arrive Location",
						value: "arriveLocation",
						class: "blue-grey lighten-4"
					},
					{
						text: "Date",
						value: "date",
						class: "blue-grey lighten-4"
					},
					{
						text: "Additional Information",
						value: "additionalInfo",
						class: "blue-grey lighten-4"
					},
					{
						text: "",
						value: "edit",
						class: "blue-grey lighten-4",
						cellClass: "px-0 mx-0",
						sortable: false
					}
				],
				otherTransport: [
					{type: 'Shuttle', departLocation: 'Missisauga', arriveLocation: 'Toronto', date: '22-08-2022', additionalInfo: 'shuttle from airport to downtown'}
				],
			
				firstName: "",
				middleName: "",
				lastName: "",
				dob: "",
				travelAuth: "",
				address: "",
				city: "",
				province: "",
				postalCode: "",
				businessPhone: "",
				passportNumber: "",		
				differentTravelContact: false,		
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
				savingData: false,
				loadingData: false,
				showApproval: false,
				approved: false,
				approvedBy: "",
				approvalDate: "",
				readonly: false,
				internationalTravel: false,
				deleteDialog: false,
				admin: false,

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
			// addTravelDeskRequest() {
			// 	//TODO: update using travel desk request info
			// 	if (this.adName) {
			// 		this.travellerDialog = false;
			// 		const travellerInx = this.travellers.findIndex(
			// 			traveller => traveller.fullName == this.adName && traveller.department == this.department
			// 		);
			// 		if (travellerInx < 0)
			// 		this.travellers.push({
			// 			fullName: this.adName,
			// 			department: this.department,
			// 			branch: this.branch
			// 		});
			// 	} else this.adNameErr = true;
			// },

			// addTravelDeskRequestRecord() {
			// 	//TODO: update using travel desk request info
			// 	this.state.differentTravelContactErr = false;
			// 	this.differentTravelContactHint = "";
			// 	this.adNameErr = false;
			// 	this.adName = "";
			// 	this.state.departmentErr = this.department ? false : true;
			// 	this.state.branchErr = this.branchList.length > 0 && !this.branch ? true : false;
			// 	if (this.department && (this.branch || this.branchList.length == 0)) {
			// 		this.adNameList = this.employeeList
			// 		.filter(employee => employee.department == this.department)
			// 		.sort((a, b) => (a.fullName >= b.fullName ? 1 : -1));
			// 		// this.rentalCarDialog = true;
			// 	}
			// },

			selectUnknownDate() {
				this.state.unknownDateErr = false;
				if (!this.unknownDate) {
					this.anticipatedMonth = "";
					this.state.anticipatedMonthErr = false;
				}
			},

			selectDifferentTravelContact() {
				this.differentTravelContactHint = "";
				this.state.departmentErr = this.department ? false : true;
				this.state.branchErr = this.branchList.length > 0 && !this.branch ? true : false;
				if (!this.differentTravelContact) {
					this.travellers = [];
					return;
				}
				if (this.department && (this.branch || this.branchList.length == 0)) {
					this.state.differentTravelContactErr = false;
					this.addDifferentTravelContact();
				} else
					Vue.nextTick(() => {
					this.differentTravelContact = false;
					this.differentTravelContactHint = "Please Select the Department and Branch First!";
					});
			},

			addDifferentTravelContact() {
				this.state.travellerNumErr = false;
				if (this.travellersNum > 0) {
					this.travellers = [
						{
							fullName: this.department + " " + (this.branch ? this.branch + " " : "") + "staff",
							department: this.department,
							branch: this.branch
						}
					];
				}
			},

			checkFields() {
				this.state.purposeErr = this.purpose ? false : true;
				this.state.costErr = this.cost ? false : true;
				this.state.locationErr = this.location ? false : true;

				this.state.unknownDateErr = !this.startDate && !this.endDate && !this.unknownDate ? true : false;
				this.state.anticipatedMonthErr = this.unknownDate && !this.anticipatedMonth ? true : false;

				this.state.startDateErr = !this.startDate && this.endDate && !this.unknownDate ? true : false;
				this.state.endDateErr = this.startDate && !this.endDate && !this.unknownDate ? true : false;

				this.state.differentTravelContactErr = !this.differentTravelContact && this.travellers.length == 0 ? true : false;
				this.state.travellerNumErr =
					this.differentTravelContact && (!this.travellersNum || this.travellersNum < 1) ? true : false;

				for (const key of Object.keys(this.state)) {
					if (this.state[key]) return false;
				}
				return true;
			},

			saveNewTravelRequest() {
				if (this.checkFields()) {
					this.savingData = true;
					const body = {
						location: Vue.filter("capitalize")(this.location),
						purpose: this.purpose,
						estimatedCost: this.cost,
						reason: this.reason,
						dateUnkInd: this.unknownDate ? 1 : 0,
						month: this.anticipatedMonth,
						startDate: !this.unknownDate ? this.startDate : null,
						endDate: !this.unknownDate ? this.endDate : null,
						department: this.department,
						branch: this.branch,
						travelerUnkInd: this.differentTravelContact ? 1 : 0,
						numberTravelers: this.travellersNum,
						travelers: this.travellers,
						travelerNotes: this.travellerNotes
					};
					// console.log(body);
					const id = this.travelRequest?.preTID ? this.travelRequest.preTID : 0;
					securePost(`${PREAPPROVED_URL}/${id}`, body)
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

			initForm() {
				console.log(this.type)
				this.admin = Vue.filter("isAdmin")();

				const userDept = this.$store.state.auth.department;
				this.lockDepartment = !Vue.filter("isSystemAdmin")() || this.type != "Add New";

				this.initStates();
				this.initTravellers();
				this.initDepartments();
				this.purposeList = this.$store.state.preapproved?.travelPurposes?.map(item => item.purpose)

				this.travellers = this.type == "Add New" ? [] : this.travelRequest.travelers;
				this.purpose = this.type == "Add New" ? "" : this.travelRequest.purpose;
				this.unknownDate = this.type == "Add New" ? false : Boolean(this.travelRequest.dateUnkInd);
				this.location = this.type == "Add New" ? "" : this.travelRequest.location;
				this.cost = this.type == "Add New" ? "" : this.travelRequest.estimatedCost;
				this.reason = this.type == "Add New" ? "" : this.travelRequest.reason;
				this.startDate = this.type == "Add New" ? "" : this.travelRequest.startDate;
				this.endDate = this.type == "Add New" ? "" : this.travelRequest.endDate;
				this.department = this.type == "Add New" ? userDept : this.travelRequest.department;
				this.branch = this.type == "Add New" ? "" : this.travelRequest.branch;
				this.differentTravelContact = this.type == "Add New" ? false : Boolean(this.travelRequest.travelerUnkInd);
				this.differentTravelContactHint = "";
				this.travellersNum = this.type == "Add New" ? null : this.travelRequest.numberTravelers;
				this.anticipatedMonth = this.type == "Add New" ? "" : this.travelRequest.month;
				this.travellerNotes = this.type == "Add New" ? "" : this.travelRequest.travelerNotes;
				this.rentalCarDialog = false;
				this.adName = "";
				this.deleteDialog = false;
				console.log(this.type)
				this.readonly = this.type != "Submit" && this.type != "Edit";
				this.internationalTravel = true;//TODO: 
				if (this.type != "Add New") this.departmentChanged(this.travelRequest.branch);
				else this.departmentChanged();

				this.loadingData = false;
				this.showApproval = false;
				this.approved = this.travelRequest?.status == "Approved";
				this.approvedBy = "";
				this.approvalDate = "";

				if (
					this.travelRequest?.preTSubID &&
					(this.travelRequest.status == "Approved" || this.travelRequest.status == "Declined")
				)
				this.initSubmission(this.travelRequest.preTSubID);
			},

			initStates() {
				this.adNameErr = false;
				this.differentTravelContactHint = "";
				for (const key of Object.keys(this.state)) {
					this.state[key] = false;
				}
			},			

			initDepartments() {
				this.departmentList = [];
				const depts = this.$store.state.preapproved.departmentBranch;
				for (const key of Object.keys(depts)) {
					this.departmentList.push({
					name: key
					});
				}
			},

			initSubmission(id) {
				secureGet(`${PREAPPROVED_URL}/submissions/${id}`)
					.then(res => {
						this.showApproval = res.data.status == "Finished";
						this.approvedBy = res.data.approvedBy;
						this.approvalDate = res.data.approvalDate;
					})
					.catch(e => {
						console.log(e);
					});
			},

			downloadPdf() {
				this.loadingData = true;
				const header = {
					responseType: "application/pdf",
					headers: {
						"Content-Type": "application/text"
					}
				};

				secureGet(`${PREAPPROVED_URL}/document/${this.travelRequest.preTSubID}`, header)
					.then(res => {
						this.loadingData = false;
						const link = document.createElement("a");
						link.href = res.data;
						document.body.appendChild(link);
						link.download = this.approved ? "approval_doc.pdf" : "doc.pdf";
						link.click();
						setTimeout(() => URL.revokeObjectURL(link.href), 1000);
					})
					.catch(e => {
						this.loadingData = false;
						console.log(e);
					});
			},

			deleteTravelRequest() {
				this.deleteDialog = false;
				this.savingData = true;
				secureDelete(`${PREAPPROVED_URL}/${this.travelRequest.preTID}`)
					.then(() => {
						this.savingData = false;
						this.addNewTravelDialog = false;
						this.$emit("updateTable");
					})
					.catch(e => {
						this.savingData = false;
						console.log(e);
					});
			},

			departmentChanged(branch) {
				this.state.departmentErr = false;
				this.branch = branch ? branch : "";
				const depts = this.$store.state.preapproved.departmentBranch;
				if (this.department) {
					this.branchList = depts[this.department].branches;
				} else {
					this.branchList = [];
				}
			},

			editFlight(item) {
				this.travellers = this.travellers.filter(
					traveller => !(traveller.fullName == item.fullName && traveller.department == item.department)
				);
				if (this.travellers.length == 0 && this.differentTravelContact) {
					this.travellersNum = null;
				}
			},

			removeFlight(item) {
				this.travellers = this.travellers.filter(
					traveller => !(traveller.fullName == item.fullName && traveller.department == item.department)
				);
				if (this.travellers.length == 0 && this.differentTravelContact) {
					this.travellersNum = null;
				}
			}
		}
	};
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">

</style>