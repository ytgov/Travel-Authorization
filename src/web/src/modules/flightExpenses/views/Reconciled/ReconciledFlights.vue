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
				@click="openUnReconcile"          
				class="ml-4"
				elevation="5"				
				color="primary">
				UnReconcile
			</v-btn>
		
		</v-row>
		<v-data-table
			:headers="headers"
			:items="reconciledFlights"
			:items-per-page="5"
			class="elevation-1"
			v-model="selectedFlights"
			:show-select="admin">

			<template v-slot:[`item.cost`]="{ item }">				
				${{ item.cost }}
			</template>		
		
		</v-data-table>

		<v-dialog v-model="unReconcileDialog" persistent max-width="400px">
			<v-card>
				<v-card-title class="warning" style="border-bottom: 1px solid black">
					<div class="text-h5">Unreconcile Flights</div>
				</v-card-title>

				<v-card-text class="mt-4">
					By Unreconciling these records, the period will 
					be removed and the record will be returned to 
					the reconcile list.					
				</v-card-text>

				<v-card-actions>
					<v-btn color="grey darken-5" @click="unReconcileDialog = false"> Cancel </v-btn>
					<v-btn class="ml-auto" color="green darken-1" @click="unReconcile"> Continue </v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import Vue from "vue";

import { ExportToCsv } from 'export-to-csv';

export default {
	
	name: "ReconciledFlights",
	props: {
		reconciledFlights: {
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
					text: "Reconcile Period",
					value: "reconcilePeriod",
					class: "blue-grey lighten-4"
				}
				
			],
			admin: false,
			unReconcileDialog: false,
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
		updateTable() {
			this.$emit("updateTable");
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
					reconciled: flight.reconciled? flight.reconciled:'',
					reconcilePeriod: flight.reconcilePeriod? flight.reconcilePeriod:''					
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
		},

		openUnReconcile() {
			this.unReconcileDialog = true;
		}, 

		unReconcile() {
			//TODO: remove period and change to reconcile=no
			this.unReconcileDialog = false;
			this.updateTable();
		}
	}
};
</script>

<style scoped>
	::v-deep(tbody tr:nth-of-type(even)) {
		background-color: rgba(0, 0, 0, 0.05);
	}
</style>
