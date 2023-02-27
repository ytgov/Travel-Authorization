<template>
	<div>		
		<div id="question-card">Question</div>
		<v-card class="mx-0 mb-0 " elevation="2" outlined>

			<v-row class="mt-3 mb-0 mx-0">
				<v-col cols="8">
					<v-select
						:items="questionList"								
						:error="state.questionTypesErr"
						@input="state.questionTypesErr=false"							
						label="About"
						v-model="question.requestType"								
						outlined/>		
				</v-col>											
			</v-row>

			<v-row class="my-n10 mx-0">
				<v-col cols="12">
					<v-text-field								
						:error="state.questionErr"
						@input="state.questionErr=false"								
						label="Question"
						v-model="question.question"								
						outlined/>
				</v-col>
			</v-row>

			<v-row class="my-n5 mx-0">
				<v-col cols="12">
					<v-text-field								
						:error="state.responseErr"
						@input="state.responseErr=false"								
						label="Response"
						v-model="question.response"								
						outlined/>
				</v-col>
			</v-row>
		</v-card>

	</div>
</template>

<script>
	// import Vue from "vue";

	export default {		
		name: "NewQuestion",
		props: {			
			question: {}			
		},
		data() {
			return {
				questionList: ["Flight", "Hotel", "Rental Car", "Transportation"],
				
				readonly: false,				

				state: {
					questionTypesErr: false,
					responseErr: false,
					questionErr: false					
				},

			};
		},
		mounted() {			
		},
		methods: {			
			checkFields() {
				// this.state.pickUpCityErr = this.carRequest.pickUpCity? false:true;
				// this.state.pickUpLocationErr = this.carRequest.pickUpLocation? false:true;
				// this.state.pickUpLocOtherErr = this.carRequest.pickUpLocation=="Other" && !this.carRequest.pickUpLocOther? true: false;
				
				// this.state.sameDropOffLocationErr = this.carRequest.sameDropOffLocation != null? false: true;
				// this.state.dropOffLocationErr = (!this.carRequest.sameDropOffLocation && !this.carRequest.dropOffLocation)? true: false;				
				// this.state.matchFlightTimesErr = this.carRequest.matchFlightTimes != null? false: true;				
				// this.state.vehicleTypesErr = this.carRequest.vehicleType? false: true;
				// this.state.reasonForChangeErr = false; 
				// this.state.additionalNotesErr = false;

				// this.state.pickUpDateErr = this.pickUpDate? false: true;
				// this.state.pickUpTimeErr = this.pickUpTime? false: true;

				// this.state.dropOffDateErr = this.dropOffDate? false: true;
				// this.state.dropOffTimeErr = this.dropOffTime? false: true;

				// for (const key of Object.keys(this.state)) {
				// 	if (this.state[key]) return false;
				// }
				return true;
			},

			saveRentalCarRequest() {
				// if (this.checkFields()) {					
				// 	this.carRequest.pickUpDate=this.pickUpDate+'T'+this.pickUpTime+':00.000Z';
				// 	this.carRequest.dropOffDate=this.dropOffDate+'T'+this.dropOffTime+':00.000Z';					
				// 	this.$emit("updateTable",this.type)
				// 	this.rentalCarDialog= false
				// }
			},

			initForm() {
				// this.initStates();
				// const flightDates = Vue.filter("flightStartEnd")(this.flightRequests)
				// this.flightStart= flightDates.start
				// this.flightEnd= flightDates.end

				// if(this.type == "Add New"){
				// 	this.carRequest.pickUpCity=""
				// 	this.carRequest.pickUpLocation=""
				// 	this.carRequest.pickUpLocOther=""					
				// 	this.carRequest.dropOffLocation= ""
				// 	this.carRequest.dropOffLocOther=""
				// 	this.carRequest.sameDropOffLocation=true
				// 	this.carRequest.vehicleType=""
				// 	this.carRequest.pickUpDate=""
				// 	this.carRequest.dropOffDate=""
				// 	this.carRequest.additionalNotes=""
				// 	this.carRequest.status="Requested"//, Reserved"
				// 	this.carRequest.vehicleChangeRationale=""
				// 	this.carRequest.matchFlightTimes=false

				// 	this.pickUpDate=""
				// 	this.pickUpTime=""
				// 	this.dropOffDate=""
				// 	this.dropOffTime=""
				// }else{
				// 	this.pickUpDate=this.carRequest.pickUpDate.slice(0,10)
				// 	this.pickUpTime=this.carRequest.pickUpDate.slice(11,16)
				// 	this.dropOffDate=this.carRequest.dropOffDate.slice(0,10)
				// 	this.dropOffTime=this.carRequest.dropOffDate.slice(11,16)
				// 	if(!this.flightStart || !this.flightEnd) this.carRequest.matchFlightTimes=false
				// }				
			
			},

			initStates() {				
				// for (const key of Object.keys(this.state)) {
				// 	this.state[key] = false;
				// }
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