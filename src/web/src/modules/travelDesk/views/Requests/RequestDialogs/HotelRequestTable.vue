<template>
	<div>
		<div id="hotel-request">Hotel Request</div>
		<v-card class="mx-5 my-5" elevation="2" outlined>
			<v-row class="mt-3 mx-3">
				<new-hotel-request
					class="ml-auto mr-3"
					type="Add New"
					@updateTable="updateTable"
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
									type="Edit"
									@updateTable="updateTable"
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
		</v-card>
	</div>
</template>

<script>

	import NewHotelRequest from "./NewHotelRequest.vue";

	export default {
		components: {			
			NewHotelRequest
		},
		name: "HotelRequestTable",
		props: {
			readonly: Boolean,
			hotels: {}
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

<style scoped lang="css" src="@/styles/_travel_desk.css">

</style>