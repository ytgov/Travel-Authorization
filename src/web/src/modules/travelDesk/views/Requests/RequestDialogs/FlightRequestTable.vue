<template>
	<div>
		<v-row class="mt-0 mx-0">
			<new-flight-request
				class="ml-auto mr-3"
				type="Add New"
				@updateTable="updateTable"
				:flightRequest="flightRequest"/>								
		</v-row>
		<v-row class="mb-3 mx-0">
			<v-col cols="12" v-if="flightRequests?.length>0">
				<v-data-table 
					:headers="flightHeaders" 
					:items="flightRequests" 
					:expanded.sync="expanded"
					:show-expand="false"
					hide-default-footer 
					class="elevation-1">
					<template v-slot:expanded-item="{item }">						
						<td v-if="showFlightOptions" :colspan="6" >
							<!-- {{ item.flightOptions }} -->
							<v-row v-for="flightOption,inx in item.flightOptions" :key="'flight-'+flightOption.flightOptionID+'-'+inx">
								<v-col>
									<flight-option-card :flightOption="flightOption" :preferenceList="Array.from(Array(item.flightOptions.length+1).keys()).slice(1)" />
								</v-col>
							</v-row>							
						</td>								
					</template>

					<template v-slot:[`item.date`]="{ item }">
						{{item.date | beautifyDateTime }}
					</template>
					
					<template v-slot:[`item.edit`]="{ item }">
						<v-row v-if="travelDeskUser" class="mx-0 py-0">	
							<travel-port-modal								
								:flightOptions="item.flightOptions"
								:flightRequest="item"
								/>
						</v-row>
						<v-row class="mx-0 py-0 mt-n9 mb-n6">
							<v-col cols="6">						
								<new-flight-request									
									type="Edit"
									@updateTable="updateTable"
									:flightRequest="item"/>
							</v-col>
							<v-col cols="6">		
								<v-btn
									v-if="!readonly"
									@click="removeFlight(item)"
									style="min-width: 0"
									color="transparent"
									class="px-1 pt-2"
									small><v-icon class="" color="red">mdi-close</v-icon>
							</v-btn>
							</v-col>
						</v-row>
					</template>
				</v-data-table>
			</v-col>								
		</v-row>
	</div>
</template>

<script>

	import NewFlightRequest from "./NewFlightRequest.vue";
	import FlightOptionCard from "./FlightComponents/FlightOptionCard.vue";
	import TravelPortModal from '../../Desk/Components/TravelPortModal.vue'

	export default {
		components: {			
			NewFlightRequest,
			FlightOptionCard,
			TravelPortModal
		},
		name: "FlightRequestTable",
		props: {
			readonly: Boolean,
			flightRequests: {},
			travelDeskUser:{
				type: Boolean,
				default: false
			},
			showFlightOptions:{
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				flightHeaders: [
					{ text: "Depart Location",  value: "departLocation",   	class: "blue-grey lighten-4", sortable: false},
					{ text: "Arrive Location",  value: "arriveLocation",  	class: "blue-grey lighten-4", sortable: false},
					{ text: "Date",       		value: "date",       		class: "blue-grey lighten-4"},
					{ text: "Time Preference",  value: "timePreference",	class: "blue-grey lighten-4", sortable: false},
					{ text: "Seat Preference",  value: "seatPreference",    class: "blue-grey lighten-4", sortable: false},
					{ text: "",     			value: "edit", 				class: "blue-grey lighten-4", width: "4rem", sortable: false}
				],
				flightRequest:{},
				tmpId:1,
				admin: false,
				travelerDetails: {},
				savingData: false,
				expanded: [true],
			};
		},
		mounted() {	
			this.initForm()					
		},
		methods: {
			updateTable(type) {
				
				if(type=='Add New'){
					console.log(this.flightRequests)
					this.flightRequest.tmpId=this.tmpId
					this.flightRequests.push(JSON.parse(JSON.stringify(this.flightRequest)))
					this.tmpId++
				}
			},	
			
			initForm(){
				const flightRequest = {}
				flightRequest.flightRequestID=null
				flightRequest.tmpId=null
				
				flightRequest.departLocation="";
				flightRequest.arriveLocation="";		
				flightRequest.date="";
				flightRequest.timePreference="";
				flightRequest.seatPreference="";
				// flightRequest.status="Requested";

				this.flightRequest = flightRequest								
			},

			editFlight(item) {				
				this.flightRequest=item						
			},

			removeFlight(item) {
				console.log(item)
				let delIndex = -1
				if(item.flightRequestID>0)
					delIndex = this.flightRequests.findIndex(flight => (flight.flightRequestID && flight.flightRequestID == item.flightRequestID) );
				else
					delIndex = this.flightRequests.findIndex(flight => (flight.tmpId && flight.tmpId == item.tmpId));				
				console.log(delIndex)
				if(delIndex>=0) this.flightRequests.splice(delIndex,1)
			},
		}
	};
</script>

<style scoped>

::v-deep .v-data-table>.v-data-table__wrapper tbody tr.v-data-table__expanded__content {
	background: #F9F9F9 !important;
}
</style>