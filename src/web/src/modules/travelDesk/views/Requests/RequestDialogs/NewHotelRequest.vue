<template>
	<div>
		<v-dialog v-model="hotelDialog" persistent max-width="80%">
			<template v-slot:activator="{ on, attrs }">
				<v-btn				
				:class="type=='Add New'? 'my-4 right':'mx-0 px-0'"					
					:color="type=='Add New'? 'primary':'transparent'"
					style="min-width: 0;"
					@click="initForm()"
					v-bind="attrs"
					v-on="on">
					<div v-if="type=='Add New'" >Add Hotel</div>
					<v-icon v-else class="mx-0 px-0" color="blue">mdi-pencil</v-icon>
				</v-btn>
			</template>

			<v-card>
				<v-card-title class="blue">
					<div class="text-h5">
						Add Hotel
					</div>
				</v-card-title>

				<v-card-text>					
					
					<v-row class="mt-5 mx-3">
						<v-col cols="4">
							<v-text-field								
								:error="state.checkInErr"
								v-model="hotelRequest.checkIn"
								@input="state.checkInErr = false"
								label="Check-in Date"
								outlined
								:min="minDate"
								:max="maxDate"
								type="date"/>
							<v-text-field								
								:error="state.checkOutErr"
								v-model="hotelRequest.checkOut"
								@input="state.checkOutErr = false"
								label="Check-out Date"
								outlined
								:min="minDate"
								:max="maxDate"
								type="date"/>
							<v-autocomplete
								:items="destinations"								
								item-value="text"
								:error="state.cityErr"
								v-model="hotelRequest.city"
								@input="state.cityErr = false"
								label="City"
								outlined/>
							<v-radio-group																
								:error="state.rsvConferenceHotelErr"
								label="Conference/Meeting Hotel?"
								v-model="hotelRequest.rsvConferenceHotel"								
								outlined
								row>
								<v-radio label="Yes" :value="true"></v-radio>
								<v-radio label="No" :value="false"></v-radio>
							</v-radio-group>
						</v-col>						
						<v-col cols="8">
							<v-textarea								
								:error="state.additionalInfoErr"
								v-model="hotelRequest.additionalInformation"
								label="Additional Information"
								rows="8"
								outlined
								:clearable="!readonly"/>	
						</v-col>				
					</v-row>

					<v-row class="mt-0 mx-3">
						<v-col cols="4">
							<v-text-field
								:error="state.conferenceNameErr"
								v-model="hotelRequest.conferenceName"
								@input="state.conferenceNameErr = false"
								label="Conference/Meeting Name"
								outlined/>						
							
						</v-col>						
						<v-col cols="8">
							<v-text-field								
								:error="state.conferenceHotelNameErr"
								v-model="hotelRequest.conferenceHotelName"
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
						class="ml-auto"
						color="green darken-1"
						@click="saveHotelRequest()">
						<div v-if="type == 'View'">Save</div>
						<div v-else>Add</div>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>	
	</div>
</template>

<script>
	import Vue from "vue";

	export default {		
		name: "NewHotelRequest",
		props: {
			type: {
				type: String
			},
			hotelRequest: {},
			flightRequests: {},
			minDate: { type: String, default:""	},
			maxDate: { type: String, default:""	},
		},
		data() {
			return {			
				checkIn: "",
				checkOut: "",				
				hotelDialog: false,
				readonly: false,

				state: {
					checkInErr: false,
					checkOutErr: false,
					cityErr: false,
					rsvConferenceHotelErr: false,
					conferenceNameErr: false,
					conferenceHotelNameErr: false,
					additionalInfoErr: false					
				},
				destinations:[],
			};
		},
		mounted() {
			this.destinations = this.$store.state.traveldesk.destinations;		
		},
		methods: {

			checkFields() {

				this.state.checkInErr = this.hotelRequest.checkIn? false:true;
				this.state.checkOutErr = this.hotelRequest.checkOut? false:true;
				this.state.cityErr = this.hotelRequest.city? false:true;
				this.state.rsvConferenceHotelErr = this.hotelRequest.rsvConferenceHotel != null? false: true;
				this.state.conferenceNameErr = this.hotelRequest.conferenceName? false:true;
				this.state.conferenceHotelNameErr = this.hotelRequest.conferenceHotelName? false:true;
				this.state.additionalInfoErr = false;

				for (const key of Object.keys(this.state)) {
					if (this.state[key]) return false;
				}
				return true;
			},

			saveHotelRequest() {
				if (this.checkFields()) {
					this.$emit("updateTable", this.type);
					this.hotelDialog = false;
				}
				
			},

			initForm() {

				this.initStates();
				const flightDates = Vue.filter("flightStartEnd")(this.flightRequests)				

				if(this.type == "Add New"){

					this.hotelRequest.checkIn=flightDates.start;
					this.hotelRequest.checkOut=flightDates.end;
					this.hotelRequest.city="";
					this.hotelRequest.rsvConferenceHotel=true;
					this.hotelRequest.conferenceName="";
					this.hotelRequest.conferenceHotelName="";
					this.hotelRequest.additionalInformation="";
					
				}
					
			},

			initStates() {				
				for (const key of Object.keys(this.state)) {
					this.state[key] = false;
				}
			}
		}
	};
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">

.label {
	font-weight: 600;
	font-size: 10pt !important;
}

</style>