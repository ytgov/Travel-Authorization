<template>
	<div class="mx-10 mb-5">
		<v-data-table
			:headers="headers"
			:items="authorizedTravels"
			:items-per-page="5"
			class="elevation-1 mt-4">

			<template v-slot:[`item.name`]="{ item }">
				{{item.name.replace('.', ' ')}}
			</template>			

			<template v-slot:[`item.location`]="{ item }">
				{{getLocationName(item.locationIds)}}
			</template>

			<template v-slot:[`item.startDate`]="{ item }">
				<div v-if="item.dateUnkInd">
					{{ item.month }}
				</div>
				<div v-else>
					<div>
						<!-- eslint-disable-next-line vue/no-parsing-error -->
						{{ item.startDate | beautifyDate }}
					</div>					
				</div>
			</template>
			<template v-slot:[`item.endDate`]="{ item }">
				<div v-if="item.dateUnkInd">
					{{ item.month }}
				</div>
				<div v-else>					
					<div>
						<!-- eslint-disable-next-line vue/no-parsing-error -->
						{{ item.endDate | beautifyDate }}
					</div>
				</div>
			</template>

			<template v-slot:[`item.edit`]="{ item }">
				<new-travel-desk-request
					v-if="item.status=='Approved' && item.phase != 'Travel Request Submitted'"
					:type="item.status=='Approved'?((item.phase == 'Travel Approved')?'Submit': 'Review'):''"
					@updateTable="updateTable()"
					:authorizedTravel="item"/>
			</template>
		</v-data-table>
	</div>
</template>

<script>
	import Vue from "vue";
	import NewTravelDeskRequest from "./NewTravelDeskRequest.vue";


	export default {
		components: {
			NewTravelDeskRequest
		},
		name: "TravelDeskRequests",
		props: {
			authorizedTravels: {
				type: []
			}
		},
		data() {
			return {
				headers: [	
					{
						text: "Name",
						value: "name",
						class: "blue-grey lighten-4"
					},			
					{
						text: "Phase",
						value: "phase",
						class: "blue-grey lighten-4"
					},
					{
						text: "Location",
						value: "location",
						class: "blue-grey lighten-4"
					},
					{
						text: "Description",
						value: "description",
						class: "blue-grey lighten-4"
					},
					{
						text: "Start Date",
						value: "startDate",
						class: "blue-grey lighten-4"
					},
					{
						text: "End Date",
						value: "endDate",
						class: "blue-grey lighten-4"
					},
					{
						text: "Travel Auth Status",
						value: "status",
						class: "blue-grey lighten-4"
					},
					{
						text: "Travel Action",
						value: "edit",
						class: "blue-grey lighten-4",
						cellClass: "px-0 mx-0",
						sortable: false
					}
				],
				admin: false,
				department: "",				
			};
		},
		mounted() {
			this.department = this.$store.state.auth.department
			this.admin = Vue.filter("isAdmin")();
			
		},
		computed: {
			
		},
		methods: {
			updateTable() {
				this.$emit("updateTable");
			},
			getLocationName(locations){
				const names = []
				const destinations = this.$store.state.traveldesk.destinations; 
				for(const locationId of locations){
					const location = destinations.filter(dest =>dest.value==locationId)
					if (location.length > 0){
						names.push(location[0].text)
					}
					
				}
				return names.join(', ')
			}


		}
	};
	</script>

	<style scoped>
	::v-deep(tbody tr:nth-of-type(even)) {
	background-color: rgba(0, 0, 0, 0.05);
	}
	</style>
