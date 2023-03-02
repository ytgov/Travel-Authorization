<template>
	<v-card :loading="loadingData" :disabled="loadingData" en class="px-5 pb-15">
		
		<div v-if="loadingData" class="mt-10" style="text-align: center">loading ...</div>
		<v-alert v-if="alertMsg" class="mt-5" type="warning">{{ alertMsg }}</v-alert>
		<v-toolbar v-if="!loadingData" class="" height="100px" flat>
			<v-toolbar-title>Flight Expense</v-toolbar-title>

			<template v-slot:extension>
				<v-tabs v-model="tabs" active-class="primary--text teal lighten-5">
					<v-tab>Flights</v-tab>
					<v-tab>Unreconciled</v-tab>
					<v-tab>Reconciled</v-tab>
				</v-tabs>
			</template>
		</v-toolbar>

		<v-tabs-items v-if="!loadingData" v-model="tabs">
			<v-tab-item>
				<v-card flat>
					<flights 
						:flights="flights" />
				</v-card>
			</v-tab-item>
			<v-tab-item>
				<v-card flat>
					<un-reconciled-flights					
						:unReconciledFlights="unReconciledFlights"
						@updateTable="getFlights()"/>
				</v-card>
			</v-tab-item>
			<v-tab-item>
				<v-card flat>
					<reconciled-flights
						:reconciledFlights="reconciledFlights"
						@updateTable="getFlights()"/>
				</v-card>
			</v-tab-item>
		</v-tabs-items>
	</v-card>
</template>

<script>
import Flights from "./Flights.vue";
import ReconciledFlights from "./Reconciled/ReconciledFlights.vue";
import UnReconciledFlights from "./Unreconciled/UnReconciledFlights.vue";
	// import { PREAPPROVED_URL, LOOKUP_URL } from "../../../urls";
	// import { secureGet } from "../../../store/jwt";

export default {
	name: "FlightExpense",
	components: {
		Flights,
		ReconciledFlights,
		UnReconciledFlights
	},
	data() {
		return {
			tabs: null,
			flights: [],
			loadingData: false,
			reconciledFlights: [],
			unReconciledFlights: [],
			alertMsg: ""
		};
	},
	mounted() {		
		this.getFlights();
	},
	methods: {

		getFlights() {
			this.loadingData = true;
			this.flights = [
				{
					purchaseDate: '2023-03-02', 
					cost: '1000', 
					agent: 'yukon travel', 
					airline: 'Air North', 
					flightInfo: 'AC123 Vancouvcer - AC546 Whitehorse',
					finalDestination: 'Vancouver',
					dept: 'HPW',
					branch: 'TEB',
					travelerFirstName: 'Fred',
					travelerLastName: 'Hayes',
					reconciled: 'no'
				},
				{
					purchaseDate: '2024-03-02', 
					cost: '1500', 
					agent: 'yukon travel', 
					airline: 'Air Canada', 
					flightInfo: 'AC123 Victoria - AC546 Whitehorse',
					finalDestination: 'Victoria',
					dept: 'CS',
					branch: 'WLFM',
					travelerFirstName: 'Harold',
					travelerLastName: 'Jones',
					reconciled: 'yes'
				}

			]
			this.extractFlights();
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

		extractFlights() {
			this.reconciledFlights = [];
			this.unReconciledFlights = [];

			for (const flight of this.flights){				
				if (flight.reconciled == 'yes'){
					this.reconciledFlights.push(flight)
				} else {
					this.unReconciledFlights.push(flight)
				}
			}
		}
		
	}
};
</script>
