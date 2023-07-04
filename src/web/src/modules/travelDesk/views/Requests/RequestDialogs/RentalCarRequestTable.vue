<template>
	<div>
		<title-card class="mt-10 mx-5" titleWidth="11rem">
			<template #title>
				<div>Rental Car Request</div>
			</template>
			<template #body>

				<v-row class="mt-3 mx-3">
					<new-rental-car-request
						v-if="!readonly"
						class="ml-auto mr-3"
						type="Add New"
						:minDate="minDate"
						:maxDate="maxDate"
						@updateTable="updateTable"
						:flightRequests="flightRequests"
						:carRequest="carRequest"/>								
				</v-row>
				<v-row class="mb-3 mx-3">
					<v-col cols="12" v-if="rentalCars?.length>0">
						<v-data-table 
							:headers="rentalCarHeaders" 
							:items="rentalCars" 
							hide-default-footer 
							class="elevation-1">
							<template v-slot:[`item.matchFlightTimes`]="{ item }">
								{{item.matchFlightTimes? 'Yes' : 'No'}}
							</template>
							<template v-slot:[`item.pickUpLocation`]="{ item }">
								<div v-if="item.pickUpLocation=='Other'">{{item.pickUpLocOther }}</div>
								<div v-else>{{item.pickUpLocation }}</div>
							</template>

							<template v-slot:[`item.dropOffLocation`]="{ item }">
								<div v-if="item.sameDropOffLocation && item.pickUpLocation=='Other'">{{item.pickUpLocOther }}</div>
								<div v-else-if="item.sameDropOffLocation">{{item.pickUpLocation }}</div>
								<div v-else>{{item.dropOffLocation }}</div>
							</template>

							<template v-slot:[`item.pickUpDate`]="{ item }">
								{{item.pickUpDate | beautifyDateTime }}
							</template>
							<template v-slot:[`item.dropOffDate`]="{ item }">
								{{item.dropOffDate | beautifyDateTime }}
							</template>

							
							<template v-slot:[`item.edit`]="{ item }">
								<v-row class="m-0 p-0">								
									<new-rental-car-request
										v-if="!readonly"									
										type="Edit"
										:minDate="minDate"
										:maxDate="maxDate"
										@updateTable="updateTable"
										:flightRequests="flightRequests"
										:carRequest="item"/>
									<v-btn
										v-if="!readonly"
										@click="removeRentalCar(item)"
										style="min-width: 0"
										color="transparent"
										class="px-1 pt-2"
										small><v-icon class="" color="red">mdi-close</v-icon>
									</v-btn>
								</v-row>
							</template>
						</v-data-table>
					</v-col>								
				</v-row>
			</template>
		</title-card>				
	</div>
</template>

<script>
	import TitleCard from '../../Common/TitleCard.vue';
	import NewRentalCarRequest from "./NewRentalCarRequest.vue";

	export default {
		components: {	
			TitleCard,
			NewRentalCarRequest
		},
		name: "NewTravelDeskRequest",
		props: {
			readonly: Boolean,
			rentalCars: {},
			flightRequests: {},
			authorizedTravel: {required: false},
		},
		data() {
			return {
				rentalCarHeaders: [
					{ text: "Match Flight Times", value: "matchFlightTimes", class: "blue-grey lighten-4", sortable: false},
					{ text: "Pick-Up City",       value: "pickUpCity",		 class: "blue-grey lighten-4", sortable: false},
					{ text: "Pick-up Location",   value: "pickUpLocation",   class: "blue-grey lighten-4", sortable: false},
					{ text: "Drop-off City",      value: "dropOffCity",		 class: "blue-grey lighten-4", sortable: false},
					{ text: "Drop-off Location",  value: "dropOffLocation",  class: "blue-grey lighten-4", sortable: false},
					{ text: "Pick-up Date",       value: "pickUpDate",       class: "blue-grey lighten-4"},
					{ text: "Drop-off Date",      value: "dropOffDate",      class: "blue-grey lighten-4"},
					
					{ text: "Vehicle Type",       value: "vehicleType",      class: "blue-grey lighten-4", sortable: false},
					{ text: "Reason Change",      value: "vehicleChangeRationale", class: "blue-grey lighten-4", sortable: false},
					{ text: "Additional Notes",   value: "additionalNotes",  class: "blue-grey lighten-4", sortable: false},
					{ text: "",     value: "edit", class: "blue-grey lighten-4", width: "4rem", sortable: false}
				],
				carRequest:{},
				tmpId:1,
				admin: false,
				travelerDetails: {},
				savingData: false,
				minDate:"",
				maxDate:"",
			};
		},
		mounted() {	
			this.initForm()					
		},
		methods: {
			updateTable(type) {
				
				if(type=='Add New'){
					this.carRequest.tmpId=this.tmpId
					this.rentalCars.push(JSON.parse(JSON.stringify(this.carRequest)))
					this.tmpId++
				}
			},	
			
			initForm(){

				if(this.authorizedTravel?.startDate && this.authorizedTravel?.endDate){
					this.minDate = this.authorizedTravel.startDate.slice(0,10)
					this.maxDate = this.authorizedTravel.endDate.slice(0,10)
				}

				const carRequest = {}
				carRequest.rentalVehicleID=null
				carRequest.tmpId=null
				carRequest.pickUpCity=""
				carRequest.dropOffCity=""
				carRequest.pickUpLocation=""
				carRequest.pickUpLocOther=""
				carRequest.dropOffLocation= ""
				carRequest.dropOffLocOther=""
				carRequest.sameDropOffLocation=true
				carRequest.matchFlightTimes=false
				carRequest.pickUpDate=""
				carRequest.dropOffDate=""
				carRequest.vehicleType="Compact"
				carRequest.vehicleChangeRationale=""
				carRequest.additionalNotes=""
				carRequest.status="Requested"

				this.carRequest = carRequest								
			},

			editRentalCar(item) {				
				this.carRequest=item						
			},

			removeRentalCar(item) {
				console.log(item)
				let delIndex = -1
				if(item.rentalVehicleID>0)
					delIndex = this.rentalCars.findIndex(rentalCar => (rentalCar.rentalVehicleID && rentalCar.rentalVehicleID == item.rentalVehicleID) );
				else
					delIndex = this.rentalCars.findIndex(rentalCar => (rentalCar.tmpId && rentalCar.tmpId == item.tmpId));				
				console.log(delIndex)
				if(delIndex>=0) this.rentalCars.splice(delIndex,1)
			}
		}
	};
</script>

<style scoped>

</style>