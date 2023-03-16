<template>
	<v-card :loading="loadingData" :disabled="loadingData" en class="px-5 pb-15">
		
		<div v-if="loadingData" class="mt-10" style="text-align: center">loading ...</div>
		<v-alert v-if="alertMsg" class="mt-5" type="warning">{{ alertMsg }}</v-alert>
		
		<v-card v-if="!loadingData" class="mt-5" flat>	

			<v-card-title>Travel Summary</v-card-title>		
			
			<v-card-actions>							
				<v-btn					
					@click="switchFilterView(views.filters)"												
					elevation="5"			
					:color="views.filters?'primary':'secondary'">Filters
				</v-btn>
				<v-btn
					@click="switchGraphView(views.graphs)"          
					class="ml-4"			
					elevation="5"				
					:color="views.graphs?'primary':'secondary'">Graph
				</v-btn>
			
			</v-card-actions>
			
		</v-card>

		<v-card class="mt-5" v-if="views.graphs" flat>
			<graphs
				:filtersApplied="views.filters"
				:flightReport="flightReport"/>
		</v-card>
		
		<v-card class="mt-5" v-if="views.filters" flat>
			<filters/>
		</v-card>
		
		<v-card class="mt-5" v-if="!loadingData" flat>
			<flight-report 
				:flightReport="flightReport" />
		</v-card>
		
	</v-card>
</template>

<script>
import FlightReport from "./FlightReport.vue";
import Filters from "./Filters/Filters.vue";
import Graphs from "./Graphs/Graphs.vue";

	// import { PREAPPROVED_URL, LOOKUP_URL } from "../../../urls";
	// import { secureGet } from "../../../store/jwt";

export default {
	name: "Report",
	components: {
		FlightReport,
		Filters,
		Graphs
	},
	data() {
		return {
			views: {filters: false, graphs: false},
			flightReport: [],
			loadingData: false,
			alertMsg: ""
		};
	},
	mounted() {	
		this.initViews();	
		this.getFlights();
	},
	methods: {

		initViews() {

			this.views = {
				filters: false, 
				graphs: false
			};
		},

		getFlights() {
			this.loadingData = true;
			this.flightReport = [
				{
					dept: 'HPW',
					finalDestinationCity: 'Calgary',
					finalDestinationProvince: 'Alberta',
					totalTrips: '36', 
					totalExpenses: '46490', 
					totalFlightCost: '1586.83', 
					averageDurationDays: '4', 
					averageExpensesPerDay: '',
					averageRoundTripFlightCost: ''
				},
				{
					dept: 'Tourism',
					finalDestinationCity: 'Calgary',
					finalDestinationProvince: 'Alberta',
					totalTrips: '18', 
					totalExpenses: '56480', 
					totalFlightCost: '1365.28', 
					averageDurationDays: '7', 
					averageExpensesPerDay: '',
					averageRoundTripFlightCost: ''
				},
				{
					dept: 'CS',
					finalDestinationCity: 'Calgary',
					finalDestinationProvince: 'Alberta',
					totalTrips: '6', 
					totalExpenses: '11276.34', 
					totalFlightCost: '1378.25', 
					averageDurationDays: '3.5', 
					averageExpensesPerDay: '',
					averageRoundTripFlightCost: ''
				},
				{
					dept: 'HPW',
					finalDestinationCity: 'Vancouver',
					finalDestinationProvince: 'British Columbia',
					totalTrips: '47', 
					totalExpenses: '59482.56', 
					totalFlightCost: '1647.50', 
					averageDurationDays: '3', 
					averageExpensesPerDay: '',
					averageRoundTripFlightCost: ''
				},
				{
					dept: 'HPW',
					finalDestinationCity: 'Vancouver',
					finalDestinationProvince: 'British Columbia',
					totalTrips: '25', 
					totalExpenses: '68142', 
					totalFlightCost: '3593.24', 
					averageDurationDays: '6', 
					averageExpensesPerDay: '',
					averageRoundTripFlightCost: ''
				}
			]
			// this.extractFlights();
			this.loadingData = false;
			// TODO: get flights
			// secureGet(`${PREAPPROVED_URL}/`)
			// 	.then(resp => {
			// 		this.travelRequests = resp.data.map(x => ({
			// 			...x,
			// 			isSelectable: x.status != "Approved" && x.status != "Declined"
			// 		}));
			// 		this.getPreapprovedTravelSubmissions();
			// 	})
			// 	.catch(e => {
			// 		console.log(e);
			// 	});
		},

		switchFilterView(display){
			this.views.filters = !display;
		},

		switchGraphView(display){
			this.views.graphs = !display;
		}

		// extractFlights() {
		// 
		// }
		
	}
};
</script>
