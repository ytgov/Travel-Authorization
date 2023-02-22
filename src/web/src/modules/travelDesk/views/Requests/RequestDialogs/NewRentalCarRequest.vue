<template>
	<div>
		<v-dialog v-model="rentalCarDialog" persistent  max-width="80%">
			<template v-slot:activator="{ on, attrs }">
				<v-btn				
					:class="type=='Add New'? 'my-4 right':'mx-0 px-0'"					
					:color="type=='Add New'? 'primary':'transparent'"
					style="min-width: 0;"
					@click="initForm()"
					v-bind="attrs"
					v-on="on">
					<div v-if="type=='Add New'" >Add Rental Car</div>
					<v-icon v-else class="mx-0 px-0" color="blue">mdi-pencil</v-icon>
				</v-btn>
			</template>

			<v-card>
				<v-card-title class="blue" >
					<div class="text-h5">
						Add Rental Car
					</div>
				</v-card-title>

				<v-card-text>
<!-- <ROW-1> -->
					<v-row class="mt-5 mx-0">
						<v-col cols="4">
							<v-text-field								
								:error="state.pickUpCityErr"
								@input="state.pickUpCityErr=false"								
								label="Pick-up City"
								v-model="carRequest.pickUpCity"								
								outlined/>
						</v-col>
						<v-col cols="5">
							<label>Pick-up/Drop-off match flights</label>
							<v-radio-group								
								:error="state.matchFlightTimesErr"								
								v-model="carRequest.matchFlightTimes"								
								class="mt-1"
								row>								
								<v-radio label="Yes" :value="true"></v-radio>
								<v-radio label="No" :value="false"></v-radio>								
							</v-radio-group>
						</v-col>
						<v-col cols="3">
							<v-select
								:items="vehicleList"								
								:error="state.vehicleTypesErr"
								@input="state.vehicleTypesErr=false"							
								label="Vehicle Type"
								v-model="carRequest.vehicleType"								
								outlined/>		
						</v-col>											
					</v-row>
<!-- <ROW-2> -->					
					<v-row class="mt-0 mx-0">
						<v-col cols="3">
							<v-select
								:items="pickUpLocations"								
								:error="state.pickUpLocationErr"
								@input="state.pickUpLocationErr=false"							
								label="Pick-up Location"
								v-model="carRequest.pickUpLocation"								
								outlined/>
							<v-text-field							
								v-if="carRequest.pickUpLocation=='Other'"								
								class="mt-n3"
								:error="state.pickUpLocOtherErr"								
								label="Other Pick-up Location"
								v-model="carRequest.pickUpLocOther"								
								outlined/>
						</v-col>
						<v-col cols="2">
							<v-text-field
								:readonly="readonly"
								:error="state.pickUpDateErr"
								v-model="pickUpDate"
								@input="state.pickUpDateErr = false"
								label="Pick-up date"
								outlined
								type="date"/>
							<v-text-field
								class="mt-n3"
								:readonly="readonly"
								:error="state.dropOffDateErr"
								v-model="dropOffDate"
								@input="state.dropOffDateErr = false"
								label="Drop-off date"
								outlined
								type="date"/>
						</v-col>
						<v-col cols="2">
							<v-text-field
								:readonly="readonly"
								:error="state.pickUpTimeErr"
								v-model="pickUpTime"
								@input="state.pickUpTimeErr = false"
								label="Pick-up time"
								outlined
								type="time"/>
							<v-text-field
								class="mt-n3"
								:readonly="readonly"
								:error="state.dropOffTimeErr"
								v-model="dropOffTime"
								@input="state.dropOffTimeErr = false"
								label="Drop-off time"
								outlined
								type="time"/>
						</v-col>
						<v-col cols="5">
							<v-textarea
								:readonly="readonly"
								:error="state.reasonForChangeErr"
								v-model="carRequest.vehicleChangeRationale"
								label="Reason for Change"
								rows="4"
								outlined
								:clearable="!readonly"/>	
						</v-col>				
					</v-row>
<!-- <ROW-3> -->
					<v-row class="mt-0 mx-0">
						<v-col cols="3">
							<div class="label">Same Drop-off location?</div>
							<v-radio-group								
								:error="state.sameDropOffLocationErr"
								class="mt-1"								
								v-model="carRequest.sameDropOffLocation"
								row>
								<v-radio label="Yes" :value="true"></v-radio>
								<v-radio label="No" :value="false"></v-radio>
							</v-radio-group>
						</v-col>
						<v-col cols="3">
							<v-select
								v-if="!carRequest.sameDropOffLocation"
								:items="pickUpLocations"
								class="mt-n1"								
								:error="state.dropOffLocationErr"								
								label="Drop-off Location:"
								v-model="carRequest.dropOffLocation"								
								outlined/>
							<v-text-field							
								v-if="!carRequest.sameDropOffLocation && carRequest.dropOffLocation=='Other'"								
								class="mt-n3"
								:error="state.dropOffLocOtherErr"
								@input="state.dropOffLocOtherErr=false"							
								label="Other Drop-off Location"
								v-model="carRequest.dropOffLocOther"								
								outlined/>
						</v-col>						
						<v-col cols="6">
							<v-textarea
								:readonly="readonly"
								:error="state.additionalNotesErr"
								v-model="carRequest.additionalNotes"
								label="Additional Information"
								outlined
								rows="4"
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
						class="ml-auto"
						color="green darken-1"
						@click="saveRentalCarRequest()"
						>
						<div v-if="type == 'View'">Save</div>
						<div v-else>Add</div>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>		

	
	</div>
</template>

<script>
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
				pickUpDate: "",
				pickUpTime: "",
				dropOffDate: "",
				dropOffTime: "",

				rentalCarDialog: false,
				vehicleList: ["Economy Car", "Compact Car", "Standard Car", "SUV", "Mini Van", "Luxury Car", "Pickup Truck", "Electric Car"],
				pickUpLocations: ['Airport', 'Hotel', 'Downtown', 'Other'],

				readonly: false,				

				state: {
					pickUpCityErr: false,
					pickUpLocationErr: false,
					pickUpLocOtherErr: false,
					dropOffLocationErr: false,
					dropOffLocOtherErr: false,
					sameDropOffLocationErr: false,
					matchFlightTimesErr: false,
					pickUpDateErr: false,
					pickUpTimeErr: false,
					dropOffDateErr: false,
					dropOffTimeErr: false,
					vehicleTypesErr: false,
					reasonForChangeErr: false,
					additionalNotesErr: false					
				},

			};
		},
		mounted() {			
		},
		methods: {			
			checkFields() {
				this.state.pickUpCityErr = this.carRequest.pickUpCity? false:true;
				this.state.pickUpLocationErr = this.carRequest.pickUpLocation? false:true;
				this.state.pickUpLocOtherErr = this.carRequest.pickUpLocation=="Other" && !this.carRequest.pickUpLocOther? true: false;
				
				this.state.sameDropOffLocationErr = this.carRequest.sameDropOffLocation != null? false: true;
				this.state.dropOffLocationErr = (!this.carRequest.sameDropOffLocation && !this.carRequest.dropOffLocation)? true: false;				
				this.state.matchFlightTimesErr = this.carRequest.matchFlightTimes != null? false: true;				
				this.state.vehicleTypesErr = this.carRequest.vehicleType? false: true;
				this.state.reasonForChangeErr = false; 
				this.state.additionalNotesErr = false;

				this.state.pickUpDateErr = this.pickUpDate? false: true;
				this.state.pickUpTimeErr = this.pickUpTime? false: true;

				this.state.dropOffDateErr = this.dropOffDate? false: true;
				this.state.dropOffTimeErr = this.dropOffTime? false: true;

				for (const key of Object.keys(this.state)) {
					if (this.state[key]) return false;
				}
				return true;
			},

			saveRentalCarRequest() {
				if (this.checkFields()) {					
					this.carRequest.pickUpDate=this.pickUpDate+'T'+this.pickUpTime+':00.000Z';
					this.carRequest.dropOffDate=this.dropOffDate+'T'+this.dropOffTime+':00.000Z';					
					this.$emit("updateTable",this.type)
					this.rentalCarDialog= false
				}
			},

			initForm() {
				this.initStates();

				if(this.type == "Add New"){
					this.carRequest.pickUpCity=""
					this.carRequest.pickUpLocation=""
					this.carRequest.pickUpLocOther=""					
					this.carRequest.dropOffLocation= ""
					this.carRequest.dropOffLocOther=""
					this.carRequest.sameDropOffLocation=true
					this.carRequest.vehicleType=""
					this.carRequest.pickUpDate=""
					this.carRequest.dropOffDate=""
					this.carRequest.additionalNotes=""
					this.carRequest.status="Requested"//, Reserved"
					this.carRequest.vehicleChangeRationale=""
					this.carRequest.matchFlightTimes=false

					this.pickUpDate=""
					this.pickUpTime=""
					this.dropOffDate=""
					this.dropOffTime=""
				}else{
					this.pickUpDate=this.carRequest.pickUpDate.slice(0,10)
					this.pickUpTime=this.carRequest.pickUpDate.slice(11,16)
					this.dropOffDate=this.carRequest.dropOffDate.slice(0,10)
					this.dropOffTime=this.carRequest.dropOffDate.slice(11,16)
				}				
			
			},

			initStates() {				
				for (const key of Object.keys(this.state)) {
					this.state[key] = false;
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