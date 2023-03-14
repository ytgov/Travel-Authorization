<template>
	<div>
		<v-dialog v-model="itineraryDialog" persistent  max-width="60%">
			<template v-slot:activator="{ on, attrs }">
				<v-btn				
					class="mx-0 px-3"					
					color="success"
					style="min-width: 0;"
					@click="initForm()"
					v-bind="attrs"
					v-on="on"
					>View Itinerary
				</v-btn>
			</template>

			<v-card>
				<v-card-title class="success white--text" >
					<div class="text-h5">
						Travel Itinerary
					</div>
				</v-card-title>

				<v-card-text>

					<title-card class="mt-10" titleWidth="11rem" largeTitle>
						<template #title>
							<div>Flight Details</div>
						</template>
						<template #body>							
							<table style="width:99%;" class="mx-2 my-1">
								<tbody > 
									<tr style="line-height:1rem;">
										<td style="width:16%;" >Flight:</td>
										<td colspan="2">{{flightSegment.flightNumber}}</td>                                
									</tr>                           
									<tr style="background:#F9F9F9;">
										<td style="width:16%;" >Departure:</td>
										<td style="width:30%;" >{{flightSegment.departDate | beautifyDateTime}}</td>
										<td style="width:50%;" >{{flightSegment.departLocation}}</td>
									</tr>
									<tr style="line-height:1rem;">
										<td style="width:16%;" >Arrival:</td>
										<td style="width:30%;" >{{flightSegment.arriveDate | beautifyDateTime}}</td>
										<td style="width:50%;" >{{flightSegment.arriveLocation}}</td>
									</tr>
									<tr style="background:#F9F9F9;">
										<td style="width:16%;" >Duration</td>
										<td style="wi
										dth:30%;" >{{flightSegment.duration}}</td>
										<td style="width:50%;" ></td>
									</tr>                                
								</tbody>
							</table>				
						</template>
					</title-card>	
				</v-card-text>
				<v-card-actions>
					<v-btn color="grey darken-5" @click="itineraryDialog = false">
						Close
					</v-btn>
				</v-card-actions>
			</v-card>	
		</v-dialog>	
	</div>
</template>

<script>
	import TitleCard from '../../Common/TitleCard.vue';

	export default {
		components: {
			TitleCard
		},
		name: "ItineraryModal",
		props: {		
		},
		data() {
			return {
				itineraryDialog: false,
				flightSegment: {},				
			};
		},
		mounted() {	
			
		},
		methods: {
			initForm(){
				this.flightSegment ={
					flightNumber:'Air Canada - AC700',
					departDate: '2023-05-09T8:00',
					departLocation: 'Whitehorse (YXY) Int. Arpt Terminal:',
					arriveDate: '2023-05-09T10:25',
					arriveLocation: 'Vancouver (YVR) Int. Arpt Terminal:',
					duration: '2 Hour(s) 25 Minutes',
				}
			}
		}
	};
</script>

<style scoped>

</style>