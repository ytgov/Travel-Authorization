<template>
	<div>	
		<div class="mt-4">{{travelerDetails}}</div>
		<div id="traveller-detail">Traveller Details</div>					
		<v-card elevation="2" outlined>

			<v-row class="mt-5 mx-3">
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="state.firstNameErr"
						label="Legal First Name"
						v-model="travelerDetails.legalFirstName"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="state.middleNameErr"
						label="Legal Middle Name"
						v-model="travelerDetails.legalMiddleName"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="state.lastNameErr"
						label="Legal Last Name"
						v-model="travelerDetails.legalLastName"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
					:readonly="readonly"
					:error="state.birthDateErr"
					v-model="travelerDetails.birthDate"
					@input="state.birthDateErr = false"
					label="Birth Date"
					outlined
					type="date"/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="state.travelAuthErr"
						label="Travel Auth"
						v-model="travelerDetails.travelAuth"								
						outlined/>
				</v-col>						
			</v-row>
			<v-row class="mt-0 mx-3">
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="state.addressErr"
						label="Address"
						v-model="travelerDetails.strAddress"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="state.cityErr"
						label="City"
						v-model="travelerDetails.city"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="state.provinceErr"
						label="Province"
						v-model="travelerDetails.province"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="state.postalCodeErr"
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
						:error="state.passportNumberErr"
						label="Passport Number"
						v-model="travelerDetails.passportNum"								
						outlined/>
				</v-col>
				<v-col cols="2" v-if="travelerDetails.internationalTravel">
					<v-text-field
						:readonly="readonly"								
						:error="state.passportCountryErr"
						label="Passport Country"
						v-model="travelerDetails.passportCountry"								
						outlined/>
				</v-col>						
			</v-row>

			<v-row class="mt-0 mx-3">
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="state.businessPhoneErr"									
						label="Business Phone"
						v-model="travelerDetails.busPhone"								
						outlined/>
				</v-col>
				<v-col cols="2">
					<v-text-field
						:readonly="readonly"								
						:error="state.businessEmailErr"									
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
						:error="state.travelPhoneErr"									
						label="Travel Phone"
						v-model="travelerDetails.travelPhone"								
						outlined/>
				</v-col>
				<v-col cols="3" v-if="travelerDetails.travelContact">
					<v-text-field
						:readonly="readonly"								
						:error="state.travelEmailErr"									
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
			travelerDetails: {}
		},
		data() {
			return {
				admin: false,

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
				},

				
			};
		},
		mounted() {	
			console.log('mount')					
		},
		methods: {
			// updateTable() {
			// 	this.$emit("updateTable");
			// },			
		}
	};
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">

</style>