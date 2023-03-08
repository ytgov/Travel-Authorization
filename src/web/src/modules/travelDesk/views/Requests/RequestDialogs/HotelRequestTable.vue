<template>
	<div>
		<title-card class="mt-10 mx-5" titleWidth="7.5rem">
			<template #title>
				<div>Hotel Request</div>
			</template>
			<template #body>							
		
				<v-row class="mt-3 mx-3">
					<new-hotel-request
						v-if="!readonly"
						class="ml-auto mr-3"
						type="Add New"
						:minDate="minDate"
						:maxDate="maxDate"
						@updateTable="updateTable"
						:flightRequests="flightRequests"
						:hotelRequest="hotelRequest"/>
				</v-row>
				<v-row class="mb-3 mx-3">
					<v-col cols="12" v-if="hotels?.length>0">
						<v-data-table 
							:headers="hotelHeaders" 
							:items="hotels" 
							hide-default-footer 
							class="elevation-1">

							<template v-slot:[`item.rsvConferenceHotel`]="{ item }">
								{{item.rsvConferenceHotel? 'Yes' : 'No'}}
							</template>

							<template v-slot:[`item.checkIn`]="{ item }">
								{{item.checkIn | beautifyDateTime }}
							</template>

							<template v-slot:[`item.checkOut`]="{ item }">
								{{item.checkOut | beautifyDateTime }}
							</template>

							<template v-slot:[`item.edit`]="{ item }">

								<v-row class="m-0 p-0">								
									<new-hotel-request
										v-if="!readonly"									
										type="Edit"
										:minDate="minDate"
										:maxDate="maxDate"
										@updateTable="updateTable"
										:flightRequests="flightRequests"
										:hotelRequest="item"/>
									<v-btn
										v-if="!readonly"
										@click="removeHotel(item)"
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
	import NewHotelRequest from "./NewHotelRequest.vue";

	export default {
		components: {
			TitleCard,
			NewHotelRequest
		},
		name: "HotelRequestTable",
		props: {
			readonly: Boolean,
			hotels: {},
			flightRequests: {},
			authorizedTravel: {required: false},
		},
		data() {
			return {
				hotelHeaders: [
					{ text: "Check-in", 				value: "checkIn", 		   		class: "blue-grey lighten-4"},
					{ text: "Check-out",				value: "checkOut",		        class: "blue-grey lighten-4"},
					{ text: "City", 					value: "city",	   			    class: "blue-grey lighten-4", sortable: false},
					{ text: "Conference Hotel?", 		value: "rsvConferenceHotel",	class: "blue-grey lighten-4", sortable: false},
					{ text: "Conference/Meeting Name",  value: "conferenceName",   	    class: "blue-grey lighten-4", sortable: false},
					{ text: "Conference/Meeting Hotel", value: "conferenceHotelName",   class: "blue-grey lighten-4", sortable: false},
					{ text: "Additional Information",   value: "additionalInformation", class: "blue-grey lighten-4", sortable: false},
					{ text: "",     					value: "edit", 			        class: "blue-grey lighten-4", width: "4rem", sortable: false}
				],
				hotelRequest:{},
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
					this.hotelRequest.tmpId=this.tmpId
					this.hotels.push(JSON.parse(JSON.stringify(this.hotelRequest)))
					this.tmpId++
				}
			},	
			
			initForm(){
				
				if(this.authorizedTravel?.startDate && this.authorizedTravel?.endDate){
					this.minDate = this.authorizedTravel.startDate.slice(0,10)
					this.maxDate = this.authorizedTravel.endDate.slice(0,10)
				}

				const hotelRequest = {}
				hotelRequest.hotelID=null
				hotelRequest.tmpId=null
				hotelRequest.checkIn="";
				hotelRequest.checkOut="";
				hotelRequest.city="";	
				hotelRequest.rsvConferenceHotel=true;
				hotelRequest.conferenceName="";
				hotelRequest.conferenceHotelName="";
				hotelRequest.additionalInformation="";
				hotelRequest.status="Requested";

				this.hotelRequest = hotelRequest								
			},

			editHotel(item) {				
				this.hotelRequest=item						
			},

			removeHotel(item) {
				console.log(item)
				let delIndex = -1
				if(item.hotelID>0)
					delIndex = this.hotels.findIndex(hotel => (hotel.hotelID && hotel.hotelID == item.hotelID) );
				else
					delIndex = this.hotels.findIndex(hotel => (hotel.tmpId && hotel.tmpId == item.tmpId));				
				console.log(delIndex)
				if(delIndex>=0) this.hotels.splice(delIndex,1)
			}
		}
	};
</script>

<style scoped>

</style>