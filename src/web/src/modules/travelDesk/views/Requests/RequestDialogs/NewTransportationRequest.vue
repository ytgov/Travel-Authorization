<template>
	<div>
		<v-dialog v-model="TransportationDialog" persistent >
			<template v-slot:activator="{ on, attrs }">
				<v-btn				
					class="my-4 right"					
					color="primary"
					@click="initForm()"
					v-bind="attrs"
					v-on="on">
					<div>Add Transportation</div>
				</v-btn>
			</template>

			<v-card>
				<v-card-title class="primary" style="border-bottom: 1px solid black">
					<div class="text-h5">
						Add Transportation
					</div>
				</v-card-title>

				<v-card-text>					
					<v-row class="mt-5 mx-3">
						<v-col cols="4">
							<v-select
								:items="requestList"
								:readonly="readonly"								
								:error="state.requestTypesErr"
								:disabled="readonly"
								label="Request Type:"
								v-model="requestType"								
								outlined/>		
						</v-col>
						<v-col cols="8">
						</v-col>											
					</v-row>
					<v-row class="mt-0 mx-3">
						<v-col cols="3">
							<v-text-field
								:readonly="readonly"
								:error="state.departErr"
								v-model="depart"								
								label="Depart"
								outlined/>
						</v-col>
						<v-col cols="3">
							<v-text-field
								:readonly="readonly"
								:error="state.arriveErr"
								v-model="arrive"
								label="Arrive"
								outlined/>
						</v-col>
						<v-col cols="3">
							<v-text-field
								:readonly="readonly"
								:error="state.dateTimeErr"
								v-model="dateTime"
								@input="state.dateTimeErr = false"
								label="Date"
								outlined
								type="date"/>
						</v-col>
						<v-col cols="3">
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
					<v-btn color="grey darken-5" @click="TransportationDialog = false">
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
						@click="saveTransportationRequest()"
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
					<div class="text-h5">Delete Transportation Request</div>
				</v-card-title>

				<v-card-text> </v-card-text>

				<v-card-actions>
					<v-btn color="grey darken-5" @click="deleteDialog = false"> Cancel </v-btn>
					<v-btn class="ml-auto" color="red darken-1" @click="deleteTransportationRequest()"> Delete </v-btn>
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
		name: "NewTransportationRequest",
		props: {
			type: {
				type: String
			},
			transportationRequest: {}
		},
		data() {
			return {			
				requestType: "",
				depart: "",
				arrive: "",
				date: "",
				additionalInfo: "",
				TransportationDialog: false,
				requestList: [],
				savingData: false,
				loadingData: false,
				readonly: false,
				deleteDialog: false,
				admin: false,

				state: {
					requestTypeErr: false,
					departErr: false,
					arriveErr: false,			
					dateErr: false,
					additionalInfoErr: false					
				},

			};
		},
		mounted() {			
		},
		methods: {

			checkFields() {
				this.state.requestTypeErr = this.requestType? false:true;
				this.state.departErr = this.depart?false:true;
				this.state.arriveErr = this.arrive?false: true;				
				this.state.dateErr = this.date?false: true;				
				this.state.additionalInfoErr = false;// this.additionalInfo?false: true;

				for (const key of Object.keys(this.state)) {
					if (this.state[key]) return false;
				}
				return true;
			},

			saveTransportationRequest() {
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
					const id = this.transportationRequest?.preTID ? this.transportationRequest.preTID : 0;
					securePost(`${PREAPPROVED_URL}/${id}`, body)
					.then(() => {
						this.savingData = false;
						this.TransportationDialog = false;
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

				this.requestType = this.type == "Add New" ? "" : this.transportationRequest.requestType;
				this.depart = this.type == "Add New" ? "" : this.transportationRequest.depart;
				this.arrive = this.type == "Add New" ? "" : this.transportationRequest.arrive;
				this.date = this.type == "Add New" ? "" : this.transportationRequest.date;				
				this.additionalInfo = this.type == "Add New" ? "" : this.transportationRequest.additionalInfo;
				
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

			deleteTransportationRequest() {
				//TODO: add functionality here
				this.deleteDialog = false;
				this.savingData = true;
				secureDelete(`${PREAPPROVED_URL}/${this.travelRequest.preTID}`)
					.then(() => {
						this.savingData = false;
						this.TransportationDialog = false;
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