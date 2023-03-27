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
			<filters
				:flightReport="flightReport"
				@updateFilters="updateFilters"/>
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
// import { LOOKUP_URL } from "../../../urls";
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
			alertMsg: "",
			filters: {departments: [], locations: []}
		};
	},
	mounted() {	
		this.loadingData = true;
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

		updateFilters(departments, locations){
			this.loadingData = true;
			this.filters = {departments: departments, locations: locations}
			this.getFlights();
		},

		getFlights() {
			
			const tmpFlightReport = [
				{
					dept: 'Highways and Public Works',
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
					dept: 'Tourism and Culture',
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
					dept: 'Community Services',
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
					dept: 'Highways and Public Works',
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
					dept: 'Highways and Public Works',
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

			// return secureGet(`${FLIGHTS_URL}/flights/`)
			// 	.then(resp => {						
			// 		this.flightReport = this.applyFilters(resp.data)
			//      this.loadingData = false;	
			// 	})
			// 	.catch(e => {
			// 		console.log(e);
			// 		this.alertMsg = e.response.data
			// 		this.savingData=false
			// 	});

			

			this.flightReport = this.applyFilters(tmpFlightReport);
			this.loadingData = false;			

		},		

		switchFilterView(display){
			this.views.filters = !display;
		},

		switchGraphView(display){
			this.views.graphs = !display;
		},

		applyFilters(flightReport) {			

			if (this.filters.departments?.length>0){
				flightReport = flightReport.filter(flight => this.filters.departments.includes(flight.dept));
			}

			if (this.filters.locations.Canada?.length>0){

				flightReport = flightReport.filter(flight => this.filters.locations.Canada.includes(flight.finalDestinationProvince));
			}

			return flightReport;		
		}
		
	}
};
</script>
