<template>
	<div>
		<title-card class="mt-10 mx-5 mb-5" titleWidth="15rem">
			<template #title>
				<div>Other Transportation Request</div>
			</template>
			<template #body >
				<v-row class="mt-3 mx-3">
					<new-transportation-request
						v-if="!readonly"
						class="ml-auto mr-3"
						type="Add New"
						:minDate="minDate"
						:maxDate="maxDate"
						@updateTable="updateTable"
						:otherTransportationRequest="otherTransportationRequest"/>
				</v-row>
				<v-row class="mb-3 mx-3">
					<v-col cols="12" v-if="otherTransportations?.length>0">
						<v-data-table 
							:headers="otherTransportationHeaders" 
							:items="otherTransportations" 
							hide-default-footer 
							class="elevation-1">
							<template v-slot:[`item.date`]="{ item }">
								{{item.date | beautifyDate }}
							</template>
							<template v-slot:[`item.edit`]="{ item }">
								<v-row class="m-0 p-0">								
									<new-transportation-request
										v-if="!readonly"									
										type="Edit"
										:minDate="minDate"
										:maxDate="maxDate"
										@updateTable="updateTable"
										:otherTransportationRequest="item"/>
									<v-btn
										v-if="!readonly"
										@click="removeOtherTransportation(item)"
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
	import NewTransportationRequest from "./NewTransportationRequest.vue";

	export default {
		components: {
			TitleCard,
			NewTransportationRequest
		},
		name: "TransportationRequestTable",
		props: {
			readonly: Boolean,
			otherTransportations: {},
			authorizedTravel: {required: false},
		},
		data() {
			return {
				
				otherTransportationHeaders: [
					{ text: "Type", 				  value: "transportationType", 	class: "blue-grey lighten-4", sortable: false},
					{ text: "Depart Location",   	  value: "depart",  		class: "blue-grey lighten-4", sortable: false},
					{ text: "Arrive Location",  	  value: "arrive",  		class: "blue-grey lighten-4", sortable: false},
					{ text: "Date",       			  value: "date",       		class: "blue-grey lighten-4"},					
					{ text: "Additional Information", value: "additionalNotes",  class: "blue-grey lighten-4", sortable: false},
					{ text: "",     				  value: "edit", 			class: "blue-grey lighten-4", width: "4rem", sortable: false}
				],
				otherTransportationRequest:{},
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
					this.otherTransportationRequest.tmpId=this.tmpId
					this.otherTransportations.push(JSON.parse(JSON.stringify(this.otherTransportationRequest)))
					this.tmpId++
				}
			},	
			
			initForm(){

				if(this.authorizedTravel?.startDate && this.authorizedTravel?.endDate){
					this.minDate = this.authorizedTravel.startDate.slice(0,10)
					this.maxDate = this.authorizedTravel.endDate.slice(0,10)
				}

				const otherTransportationRequest = {}
				otherTransportationRequest.transportationID=null
				otherTransportationRequest.tmpId=null
				otherTransportationRequest.transportationType=""
				otherTransportationRequest.depart=""
				otherTransportationRequest.arrive=""
				otherTransportationRequest.date=""				
				otherTransportationRequest.additionalNotes=""
				otherTransportationRequest.status="Requested"

				this.otherTransportationRequest = otherTransportationRequest								
			},

			editOtherTransportation(item) {				
				this.otherTransportationRequest=item						
			},

			removeOtherTransportation(item) {
				console.log(item)
				let delIndex = -1
				if(item.transportationID>0)
					delIndex = this.otherTransportations.findIndex(otherTransportation => (otherTransportation.transportationID && otherTransportation.transportationID == item.transportationID) );
				else
					delIndex = this.otherTransportations.findIndex(otherTransportation => (otherTransportation.tmpId && otherTransportation.tmpId == item.tmpId));				
				console.log(delIndex)
				if(delIndex>=0) this.otherTransportations.splice(delIndex,1)
			}
		}
	};
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">

</style>