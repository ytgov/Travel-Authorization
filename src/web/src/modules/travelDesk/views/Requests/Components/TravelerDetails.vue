<template>
	<div>	
		<!-- <div class="mt-4">{{travelerDetails}}</div> -->
		<div id="traveller-detail">Traveller Details</div>					
		<v-card elevation="2" outlined>

			<v-row class="mt-5 mx-3">
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="travelerState.firstNameErr"
						label="Legal First Name"
						v-model="travelerDetails.legalFirstName"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="travelerState.middleNameErr"
						label="Legal Middle Name"
						v-model="travelerDetails.legalMiddleName"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="travelerState.lastNameErr"
						label="Legal Last Name"
						v-model="travelerDetails.legalLastName"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
					:readonly="readonly"
					:error="travelerState.birthDateErr"
					v-model="travelerDetails.birthDate"
					@input="travelerState.birthDateErr = false"
					label="Birth Date"
					outlined
					type="date"/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						readonly								
						:error="travelerState.travelAuthErr"
						label="Travel Auth"
						v-model="taid"								
						outlined/>
				</v-col>						
			</v-row>
			<v-row class="mt-0 mx-3">
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="travelerState.addressErr"
						label="Address"
						v-model="travelerDetails.strAddress"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="travelerState.cityErr"
						label="City"
						v-model="travelerDetails.city"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="travelerState.provinceErr"
						label="Province"
						v-model="travelerDetails.province"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="travelerState.postalCodeErr"
						label="Postal Code"
						v-model="travelerDetails.postalCode"								
						outlined/>
				</v-col>
				<v-col cols="2" v-if="!travelerDetails.internationalTravel">
					<v-checkbox						
						:readonly="readonly"
						v-model="travelerDetails.internationalTravel"
						label="International travel"
					/>
				</v-col>
				<v-col cols="2" v-if="travelerDetails.internationalTravel">
					<v-text-field						
						:readonly="readonly"								
						:error="travelerState.passportNumberErr"
						label="Passport Number"
						v-model="travelerDetails.passportNum"								
						outlined/>
				</v-col>
				<v-col cols="2" v-if="travelerDetails.internationalTravel">
					<v-text-field
						:readonly="readonly"								
						:error="travelerState.passportCountryErr"
						label="Passport Country"
						v-model="travelerDetails.passportCountry"								
						outlined/>
				</v-col>						
			</v-row>

			<v-row class="mt-0 mx-3">
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="travelerState.businessPhoneErr"									
						label="Business Phone"
						v-model="travelerDetails.busPhone"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="travelerState.businessEmailErr"									
						label="Business Email"
						v-model="travelerDetails.busEmail"								
						outlined/>
				</v-col>				
				<v-col cols="3">
					<v-checkbox
						:readonly="readonly"
						v-model="travelerDetails.travelContact"
						label="Contact information different for travel"
					/>
				</v-col>							
				<v-col cols="2" v-if="travelerDetails.travelContact">
					<v-text-field
						:readonly="readonly"								
						:error="travelerState.travelPhoneErr"									
						label="Travel Phone"
						v-model="travelerDetails.travelPhone"								
						outlined/>
				</v-col>
				<v-col cols="3" v-if="travelerDetails.travelContact">
					<v-text-field
						:readonly="readonly"								
						:error="travelerState.travelEmailErr"									
						label="Travel Email"
						v-model="travelerDetails.travelEmail"								
						outlined/>
				</v-col>
			</v-row>
		</v-card>				
	</div>
</template>

<script>
	
	export default {
		components: {
			
		},
		name: "TravelerDetails",
		props: {			
			readonly: Boolean,
			travelerDetails: {},
			travelerState: {}
		},
		data() {
			return {
				admin: false,
				taid: ''

						
			};
		},
		mounted() {	
		
			this.taid = this.travelerDetails.TAID.toString().padStart(5, '0');
						
		},
		methods: {
			
		}
	};
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">

</style>