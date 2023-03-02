<template>
	<div class="mx-10 mb-5">
		<v-row v-if="admin" class="my-0 mx-0">
			
			<v-btn				
				:disabled="selectedFlights.length == 0"        
				@click="exportToExcel()"          
				class="ml-auto"
				elevation="5"
				color="primary">
				Export To Excel
			</v-btn>
		
		</v-row>
		<v-data-table
			:headers="headers"
			:items="flights"
			:items-per-page="5"
			class="elevation-1 mt-4"
			v-model="selectedFlights"
			:show-select="admin">			

			<template v-slot:[`item.cost`]="{ item }">				
				${{ item.cost }}
			</template>			
		</v-data-table>
	</div>
</template>

<script>
import Vue from "vue";
import { ExportToCsv } from 'export-to-csv';

export default {

	name: "Flights",
	props: {
		flights: {
			type: []
		}
	},
	data() {
		return {
			headers: [
				{
					text: "Purchase Date",
					value: "purchaseDate",
					class: "blue-grey lighten-4"
				},
				{
					text: "Cost",
					value: "cost",
					class: "blue-grey lighten-4"
				},
				{
					text: "Agent",
					value: "agent",
					class: "blue-grey lighten-4"
				},
				{
					text: "Airline",
					value: "airline",
					class: "blue-grey lighten-4"
				},
				{
					text: "Flight Info",
					value: "flightInfo",
					class: "blue-grey lighten-4"
				},
				{
					text: "Final Destination",
					value: "finalDestination",
					class: "blue-grey lighten-4"
				},
				{
					text: "Department",
					value: "dept",
					class: "blue-grey lighten-4"
				},
				{
					text: "Branch",
					value: "branch",
					class: "blue-grey lighten-4"
				},
				{
					text: "Traveler First Name",
					value: "travelerFirstName",
					class: "blue-grey lighten-4"
				},
				{
					text: "Traveler Last Name",
					value: "travelerLastName",
					class: "blue-grey lighten-4"
				},
				{
					text: "",
					value: "edit",
					class: "blue-grey lighten-4",
					cellClass: "px-0 mx-0",
					sortable: false,
					width: "1rem"
				}
			],
			admin: false,
			selectedFlights: []
		};
	},
	mounted() {
		this.admin = true;
		//TODO: update this
		const temp = Vue.filter("isAdmin")();
		console.log(temp)
	},
	
	methods: {		
		exportToExcel(){

			const csvInfo = this.selectedFlights.map(flight =>{
				return {
					purchaseDate: flight.purchaseDate?flight.purchaseDate:'',
					cost: flight.cost?'$'+flight.cost:'', 
					agent: flight.agent?flight.agent:'', 
					airline: flight.airline?flight.airline:'',
					flightInfo: flight.flightInfo?flight.flightInfo:'',
					finalDestination: flight.finalDestination?flight.finalDestination:'',					
					department: flight.dept?flight.dept:'',
					branch: flight.branch? flight.branch:'',
					travelerFirstName: flight.travelerFirstName? flight.travelerFirstName:'',
					travelerLastName: flight.travelerLastName? flight.travelerLastName:'',
					reconciled: flight.reconciled? flight.reconciled:''					
				}
			})
			const options = { 
				fieldSeparator: ',',
				quoteStrings: '"',
				decimalSeparator: '.',
				showLabels: true, 
				showTitle: false,
				title: '',
				filename: 'Flights',
				useTextFile: false,
				useBom: true,
				useKeysAsHeaders: false,
				headers: ['Purchase Date', 'Cost', 'Agent', 'Airline', 'Flight Info', 'Final Destination', 'Department', 'Branch', 'Traveler First Name', 'Traveler last Name', 'Reconciled']
			};
			const csvExporter = new ExportToCsv(options);
			csvExporter.generateCsv(csvInfo);
		}
	}
};
</script>

<style scoped>
	::v-deep(tbody tr:nth-of-type(even)) {
		background-color: rgba(0, 0, 0, 0.05);
	}
</style>