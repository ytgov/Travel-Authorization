<template>
	<div>
		<v-dialog v-model="rentalCarDialog" persistent >
			<template v-slot:activator="{ on, attrs }">
				<v-btn				
					class="my-4 right"					
					color="primary"
					@click="initForm()"
					v-bind="attrs"
					v-on="on">
					<div>Add Rental Car</div>
				</v-btn>
			</template>

			<v-card>
				<v-card-title class="primary" style="border-bottom: 1px solid black">
					<div class="text-h5">
						Add Rental Car
					</div>
				</v-card-title>

				<v-card-text>					
					<v-row class="mt-5 mx-3">
						<v-col cols="4">
							<v-text-field
								:readonly="readonly"								
								:error="state.pickUpCityErr"								
								label="Pick-up City"
								v-model="pickUpCity"								
								outlined/>
						</v-col>
						<v-col cols="4">
							<v-radio-group
								:readonly="readonly"								
								:error="state.pickUpDropOffMatchFlightsErr"
								:disabled="readonly"
								label="Pick-up/Drop-off match flights"
								v-model="pickUpDropOffMatchFlights"								
								outlined
								row>
								<v-radio label="Yes" :value="true"></v-radio>
								<v-radio label="No" :value="false"></v-radio>
							</v-radio-group>
						</v-col>
						<v-col cols="4">
							<v-select
								:items="vehicleList"
								:readonly="readonly"								
								:error="state.vehicleTypesErr"
								:disabled="readonly"
								label="Vehicle Type:"
								v-model="vehicleType"								
								outlined/>		
						</v-col>											
					</v-row>
					<v-row class="mt-0 mx-3">
						<v-col cols="4">
							<v-select
								:items="pickUpLocations"
								:readonly="readonly"								
								:error="state.pickUpLocationErr"
								:disabled="readonly"
								label="Pick-up Location:"
								v-model="pickUpLocation"								
								outlined/>
						</v-col>
						<v-col cols="4">
							<v-text-field
								:readonly="readonly"
								:error="state.pickUpDateTimeErr"
								v-model="pickUpDateTime"
								@input="state.pickUpDateTimeErr = false"
								label="Pick-up date/time"
								outlined
								type="date"/>
						</v-col>
						<v-col cols="4">
							<v-textarea
								:readonly="readonly"
								:error="state.reasonForChangeErr"
								v-model="reasonForChange"
								label="Reason for Change"
								outlined
								:clearable="!readonly"/>	
						</v-col>				
					</v-row>
					<v-row class="mt-0 mx-3">
						<v-col cols="4">
							<v-radio-group
								:readonly="readonly"								
								:error="state.sameDropOffLocationErr"
								:disabled="readonly"
								label="Same Drop-off location?"
								v-model="sameDropOffLocation"								
								outlined
								row>
								<v-radio label="Yes" :value="true"></v-radio>
								<v-radio label="No" :value="false"></v-radio>
							</v-radio-group>
							<v-select
								v-if="!sameDropOffLocation"
								:items="pickUpLocations"
								:readonly="readonly"								
								:error="state.dropOffLocationErr"
								:disabled="readonly"
								label="Drop-off Location:"
								v-model="dropOffLocation"								
								outlined/>
						</v-col>
						<v-col cols="4">
							<v-text-field
								:readonly="readonly"
								:error="state.dropOffDateTimeErr"
								v-model="dropOffDateTime"
								@input="state.dropOffDateTimeErr = false"
								label="Drop-off date/time"
								outlined
								type="date"/>
						</v-col>
						<v-col cols="4">
							<v-textarea
								:readonly="readonly"
								:error="state.additionalInfoErr"
								v-model="additionalInfo"
								label="Additional Information"
								outlined
								:clearable="!readonly"/>	
						</v-col>				
					</v-row>
				</v-card-text>

				<v-card-actions>
					<v-btn color="grey darken-5" @click="rentalCarDialog = false">
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
						@click="saveRentalCarRequest()"
						:loading="savingData">
						<div v-if="type == 'View'">Save</div>
						<div v-else>Add</div>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>		

		<v-dialog v-model="deleteDialog" persistent max-width="400px">
			<v-card>
				<v-card-title class="amber accent-2" style="border-bottom: 1px solid black">
					<div class="text-h5">Delete Rental Car Request</div>
				</v-card-title>

				<v-card-text> </v-card-text>

				<v-card-actions>
					<v-btn color="grey darken-5" @click="deleteDialog = false"> Cancel </v-btn>
					<v-btn class="ml-auto" color="red darken-1" @click="deleteRentalCarRequest()"> Delete </v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	import Vue from "vue";
	import { PREAPPROVED_URL } from "../../../../../urls";
	import { secureDelete, securePost } from "@/store/jwt";

	export default {		
		name: "NewRentalCarRequest",
		props: {
			type: {
				type: String
			},
			carRequest: {}
		},
		data() {
			return {			
				pickUpCity: "",
				pickUpLocation: "",
				dropOffLocation: "",
				sameDropOffLocation: true,
				pickUpDropOffMatchFlights: true,
				pickUpDateTime: "",
				dropOffDateTime: "",
				vehicleTypes: "",
				reasonForChange: "",
				additionalInfo: "",
				rentalCarDialog: false,
				vehicleList: [],
				pickUpLocations: [],
				savingData: false,
				loadingData: false,
				readonly: false,
				deleteDialog: false,
				admin: false,

				state: {
					pickUpCityErr: false,
					pickUpLocationErr: false,
					dropOffLocationErr: false,
					sameDropOffLocationErr: false,
					pickUpDropOffMatchFlightsErr: false,
					pickUpDateTimeErr: false,
					dropOffDateTimeErr: false,
					vehicleTypesErr: false,
					reasonForChangeErr: false,
					additionalInfoErr: false					
				},

			};
		},
		mounted() {			
		},
		methods: {

			checkFields() {

				this.state.pickUpCityErr = this.pickUpCity? false:true;
				this.state.pickUpLocationErr = this.pickUpLocation?false:true;
				this.state.sameDropOffLocationErr = this.sameDropOffLocation != null?false: true;
				this.state.dropOffLocationErr = (!this.sameDropOffLocation && this.dropOffLocation)? false:true;				
				this.state.pickUpDropOffMatchFlightsErr = this.pickUpDropOffMatchFlights != null?false: true;
				this.state.pickUpDateTimeErr = this.pickUpDateTime?false: true;
				this.state.dropOffDateTimeErr = this.dropOffDateTime?false: true;
				this.state.vehicleTypesErr = this.vehicleTypes?false: true;
				this.state.reasonForChangeErr = false; //this.reasonForChange?false: true;
				this.state.additionalInfoErr = false;// this.additionalInfo?false: true;

				for (const key of Object.keys(this.state)) {
					if (this.state[key]) return false;
				}
				return true;
			},

			saveRentalCarRequest() {
				if (this.checkFields()) {
					this.savingData = true;
					//TODO: add functionality
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
						travelerUnkInd: this.undefinedTraveller ? 1 : 0,
						numberTravelers: this.travellersNum,
						travelers: this.travellers,
						travelerNotes: this.travellerNotes
					};
					// console.log(body);
					const id = this.carRequest?.preTID ? this.carRequest.preTID : 0;
					securePost(`${PREAPPROVED_URL}/${id}`, body)
					.then(() => {
						this.savingData = false;
						this.rentalCarDialog = false;
						this.$emit("updateTable");
					})
					.catch(e => {
						this.savingData = false;
						console.log(e);
					});
				}
			},

			initForm() {
				
				this.admin = Vue.filter("isAdmin")();				

				this.initStates();
				this.initVehicles();
				this.initPickUpLocations();

				this.pickUpCity = this.type == "Add New" ? "" : this.carRequest.pickUpCity;
				this.pickUpLocation = this.type == "Add New" ? "" : this.carRequest.pickUpLocation;
				this.dropOffLocation = this.type == "Add New" ? "" : this.carRequest.dropOffLocation;
				this.sameDropOffLocation = this.type == "Add New" ? true : Boolean(this.carRequest.sameDropOffLocation);
				this.pickUpDropOffMatchFlights = this.type == "Add New" ? false : Boolean(this.carRequest.pickUpDropOffMatchFlights);
				this.pickUpDateTime = this.type == "Add New" ? "" : this.carRequest.pickUpDateTime;
				this.dropOffDateTime = this.type == "Add New" ? "" : this.carRequest.dropOffDateTime;
				this.vehicleTypes = this.type == "Add New" ? "" : this.carRequest.vehicleTypes;
				this.reasonForChange = this.type == "Add New" ? "" : this.carRequest.reasonForChange;
				this.additionalInfo = this.type == "Add New" ? "" : this.carRequest.additionalInfo;
				
				this.deleteDialog = false;
				
				this.readonly = this.type != "Submit" && this.type != "Edit";
				this.internationalTravel = true;//TODO: 				

				this.loadingData = false;				
			},

			initStates() {				
				for (const key of Object.keys(this.state)) {
					this.state[key] = false;
				}
			},

			initVehicles() {
				this.vehicleList = ['SUV', 'Sedan']// this.$store.state.preapproved.employees.map(item => {
				// 	return {
				// 		fullName: item.fullName,
				// 		department: item.department
				// 	};
				// });
			},

			initPickUpLocations() {
				this.pickUpLocations = ['Airport', 'Hotel'];//
				// const depts = this.$store.state.preapproved.departmentBranch;
				// for (const key of Object.keys(depts)) {
				// 	this.pickUpLocations.push({
				// 	name: key
				// 	});
				// }
			},			

			deleteRentalCarRequest() {
				//TODO: add functionality here
				this.deleteDialog = false;
				this.savingData = true;
				secureDelete(`${PREAPPROVED_URL}/${this.travelRequest.preTID}`)
					.then(() => {
						this.savingData = false;
						this.rentalCarDialog = false;
						this.$emit("updateTable");
					})
					.catch(e => {
						this.savingData = false;
						console.log(e);
					});
			}

		}
	};
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">

</style>