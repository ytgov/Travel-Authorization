<template>
	<v-card :loading="loadingData" :disabled="loadingData" en class="px-5 pb-15">
		<v-alert v-if="alertMsg" class="mt-5" type="warning">{{ alertMsg }}</v-alert>

		<div v-if="loadingData" class="mt-10" style="text-align: center">loading ...</div>
		
		<div v-else>	
			<v-card class="mt-5" flat>	

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

			<v-card class="mt-5" v-if="views.filters" flat>
				<filters
					:flightReport="allFlightReports"
					@updateFilters="updateFilters"/>
			</v-card>

			<v-card class="mt-5" v-if="views.graphs" flat>
				<graphs
					:filtersApplied="views.filters"
					:filteredFlightReport="flightReport"
					:allFlightReports="allFlightReports"/>
			</v-card>
			
			<v-card class="mt-5" flat>
				<flight-report 
					:flightReport="flightReport" />
			</v-card>
		</div>

	</v-card>
</template>

<script>
import FlightReport from "./FlightReport.vue";
import Filters from "./Filters/Filters.vue";
import Graphs from "./Graphs/Graphs.vue";
import { TRAVEL_COM_URL, PROFILE_URL } from "../../../urls";
import { secureGet } from "../../../store/jwt";

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
			allFlightReports: [],
			loadingData: false,
			alertMsg: "",
			filters: {departments: [], locations: []}
		};
	},
	async mounted() {	
		this.loadingData = true;
		this.initViews();
		await this.getUserAuth();
		await this.getFlights();		
		this.loadingData = false;	
	},
	
	methods: {

		initViews() {
			this.views = {
				filters: false, 
				graphs: false
			};
		},

		updateFilters(departments, locations){
			this.filters = {departments: departments, locations: locations}
			this.flightReport = this.applyFilters(this.allFlightReports);
		},

		async getUserAuth() {      
			return secureGet(`${PROFILE_URL}`)
			.then(resp => {
				this.$store.commit("auth/setUser", resp.data.data);          
			})
			.catch(e => {
				console.log(e);
			});
		},

		async getFlights() {						
			
			return secureGet(`${TRAVEL_COM_URL}/statistics`)
				.then(async (resp) => {						
					console.log(resp.data)
					this.allFlightReports = resp.data
					this.flightReport = this.applyFilters(this.allFlightReports);
				})
				.catch(e => {
					console.log(e);
					this.loadingData = false;
				});
		},

		switchFilterView(display){
			this.views.filters = !display;
		},

		switchGraphView(display){
			this.views.graphs = !display;
		},

		applyFilters(allFlightReports) {			
			let flightReport = JSON.parse(JSON.stringify(allFlightReports))
			if (this.filters.departments?.length>0){
				flightReport = flightReport.filter(flight => this.filters.departments.includes(flight.dept));
			}

			if (this.filters.locations.Canada?.length>0 ||
				this.filters.locations.Yukon?.length>0 ||
				this.filters.locations.International?.length>0
			){
				flightReport = flightReport.filter(flight => { 
					return (
						this.filters.locations.Yukon?.includes(flight.finalDestinationCity) ||
						this.filters.locations.Canada?.includes(flight.finalDestinationProvince) ||
						this.filters.locations.International?.includes(flight.finalDestinationProvince)
					)				 
				});
			}

			return flightReport;		
		}
		
	}
};
</script>
