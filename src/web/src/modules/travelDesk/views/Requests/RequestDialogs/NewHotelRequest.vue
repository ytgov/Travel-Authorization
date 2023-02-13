<template>
	<div>
		<v-dialog v-model="hotelDialog" persistent >
			<template v-slot:activator="{ on, attrs }">
				<v-btn				
					class="my-4 right"					
					color="primary"
					@click="initForm()"
					v-bind="attrs"
					v-on="on">
					<div>Add Hotel</div>
				</v-btn>
			</template>

			<v-card>
				<v-card-title class="primary" style="border-bottom: 1px solid black">
					<div class="text-h5">
						Add Hotel
					</div>
				</v-card-title>

				<v-card-text>					
					
					<v-row class="mt-0 mx-3">
						<v-col cols="4">
							<v-text-field
								:readonly="readonly"
								:error="state.checkInDateErr"
								v-model="checkInDate"
								@input="state.checkInDateErr = false"
								label="Check-in Date"
								outlined
								type="date"/>
							<v-text-field
								:readonly="readonly"
								:error="state.checkOutDateErr"
								v-model="checkOutDate"
								@input="state.checkOutDateErr = false"
								label="Check-out Date"
								outlined
								type="date"/>
							<v-radio-group
								:readonly="readonly"								
								:error="state.conferenceHotelErr"
								:disabled="readonly"
								label="Conference/Meeting Hotel?"
								v-model="conferenceHotel"								
								outlined
								row>
								<v-radio label="Yes" :value="true"></v-radio>
								<v-radio label="No" :value="false"></v-radio>
							</v-radio-group>
						</v-col>						
						<v-col cols="8">
							<v-textarea
								:readonly="readonly"
								:error="state.additionalInfoErr"
								v-model="additionalInfo"
								label="Additional Information"
								rows="8"
								outlined
								:clearable="!readonly"/>	
						</v-col>				
					</v-row>

					<v-row class="mt-0 mx-3">
						<v-col cols="4">
							<v-text-field
								:readonly="readonly"
								:error="state.conferenceNameErr"
								v-model="conferenceName"
								@input="state.conferenceNameErr = false"
								label="Conference/Meeting Name"
								outlined/>						
							
						</v-col>						
						<v-col cols="8">
							<v-text-field
								:readonly="readonly"
								:error="state.conferenceHotelNameErr"
								v-model="conferenceHotelName"
								@input="state.conferenceHotelNameErr = false"
								label="Conference/Meeting Hotel"
								outlined/>	
						</v-col>				
					</v-row>
				</v-card-text>

				<v-card-actions>
					<v-btn color="grey darken-5" @click="hotelDialog = false">
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
						@click="saveHotelRequest()"
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
					<div class="text-h5">Delete Hotel Request</div>
				</v-card-title>

				<v-card-text> </v-card-text>

				<v-card-actions>
					<v-btn color="grey darken-5" @click="deleteDialog = false"> Cancel </v-btn>
					<v-btn class="ml-auto" color="red darken-1" @click="deleteHotelRequest()"> Delete </v-btn>
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
		name: "NewHotelRequest",
		props: {
			type: {
				type: String
			},
			hotelRequest: {}
		},
		data() {
			return {			
				checkInDate: "",
				checkOutDate: "",
				conferenceHotel: true,
				conferenceName: "",
				conferenceHotelName: "",
				additionalInfo: "",
				hotelDialog: false,
				savingData: false,
				loadingData: false,
				readonly: false,
				deleteDialog: false,
				admin: false,

				state: {
					checkInDateErr: false,
					checkOutDateErr: false,
					conferenceHotelErr: false,
					conferenceNameErr: false,
					conferenceHotelNameErr: false,
					additionalInfoErr: false					
				},

			};
		},
		mounted() {			
		},
		methods: {

			checkFields() {

				this.state.checkInDateErr = this.checkInDate? false:true;
				this.state.checkOutDateErr = this.checkOutDate? false:true;
				this.state.conferenceHotelErr = this.conferenceHotel != null? false: true;
				this.state.conferenceNameErr = this.conferenceName? false:true;
				this.state.conferenceHotelNameErr = this.conferenceHotelName? false:true;
				this.state.additionalInfoErr = false;// this.additionalInfo?false: true;

				for (const key of Object.keys(this.state)) {
					if (this.state[key]) return false;
				}
				return true;
			},

			saveHotelRequest() {
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
					const id = this.hotelRequest?.preTID ? this.hotelRequest.preTID : 0;
					securePost(`${PREAPPROVED_URL}/${id}`, body)
					.then(() => {
						this.savingData = false;
						this.hotelDialog = false;
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
				this.initRequests();

				this.requestType = this.type == "Add New" ? "" : this.hotelRequest.requestType;
				this.depart = this.type == "Add New" ? "" : this.hotelRequest.depart;
				this.arrive = this.type == "Add New" ? "" : this.hotelRequest.arrive;
				this.date = this.type == "Add New" ? "" : this.hotelRequest.date;				
				this.additionalInfo = this.type == "Add New" ? "" : this.hotelRequest.additionalInfo;
				
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

			initRequests() {
				this.requestList = ['Shuttle', 'Bus', 'Train']// this.$store.state.preapproved.employees.map(item => {
				// 	return {
				// 		fullName: item.fullName,
				// 		department: item.department
				// 	};
				// });
			},						

			deleteHotelRequest() {
				//TODO: add functionality here
				this.deleteDialog = false;
				this.savingData = true;
				secureDelete(`${PREAPPROVED_URL}/${this.travelRequest.preTID}`)
					.then(() => {
						this.savingData = false;
						this.hotelDialog = false;
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