<template>
	<div class="mx-10 mb-5">
		<v-row class="my-0 mx-0">
			<v-btn
				v-if="admin"
				:disabled="selectedFlights.length == 0"        
				@click="exportToExcel()"          
				class="ml-auto"
				elevation=""
				color="primary">
				Export To Excel
			</v-btn>
			<v-btn				
				:disabled="selectedFlights.length == 0"        
				@click="openReconcile"          
				class="ml-4"
				elevation="5"				
				color="primary">
				Reconcile
			</v-btn>		
		</v-row>
		<v-data-table
			:headers="headers"
			:items="unReconciledFlights"
			:items-per-page="5"
			class="elevation-1"
			v-model="selectedFlights"
			:show-select="admin">

			<template v-slot:[`item.cost`]="{ item }">				
				${{ item.cost }}
			</template>		
		
		</v-data-table>
		<v-dialog v-model="reconcileDialog" persistent max-width="400px">
			<v-card>
				<v-card-title class="primary" style="border-bottom: 1px solid black">
					<div class="text-h5">Reconcile Flights</div>
				</v-card-title>

				<v-card-text>
					<v-select
						class="mt-5"
						label="What Period?"
						v-model="period"
						:items="periodOptions"
						outlined>
					</v-select>					
				</v-card-text>

				<v-card-actions>
					<v-btn color="grey darken-5" @click="reconcileDialog = false"> Cancel </v-btn>
					<v-btn class="ml-auto" color="green darken-1" @click="addPeriod"> Reconcile </v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import Vue from "vue";
import { ExportToCsv } from 'export-to-csv';

export default {	
	name: "UnReconciledFlights",
	props: {
		unReconciledFlights: {
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
				}
				
			],
			admin: false,
			selectedFlights: [],
			reconcileDialog: false,
			period: null,
			periodOptions: [...Array(12).keys()].map(x => x + 1)// [1,2,3,4,5,6,7,8,9,10,12,14]
		};
	},
	mounted() {		
		this.periodOptions.push(14)
		this.admin = true;
		//TODO: update this
		const temp = Vue.filter("isAdmin")();
		console.log(temp)
	},
	
	methods: {
		updateTable() {
			this.$emit("updateTable");
		},

		openReconcile() {
			this.reconcileDialog = true;
		},

		addPeriod(){
			//TODO: add the period value to the selectedFlights, mark them as reconciled and save

			this.reconcileDialog = false;
			this.updateTable();
		},

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
