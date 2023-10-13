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
			:items-per-page="15"
			dense
			class="elevation-1 mt-4"
			v-model="selectedFlights"
			item-key="invoiceDetailID"
			:show-select="admin">			

			<template v-slot:[`item.purchaseDate`]="{ item }">
				{{item.purchaseDate | beautifyDate}}
			</template>

			<template v-slot:[`item.agent`]="{ item }">
				{{item.agent | capitalize}}
			</template>

			<template v-slot:[`item.airline`]="{ item }">
				{{item.airline | capitalize}}
			</template>

			<template v-slot:[`item.travelerFirstName`]="{ item }">
				{{item.travelerFirstName | capitalize}}
			</template>

			<template v-slot:[`item.travelerLastName`]="{ item }">
				{{item.travelerLastName | capitalize}}
			</template>

			<template v-slot:[`item.flightInfo`]="{ item }">
				<div v-for="flight,inx in item.flightInfo.split(',')" :key="'flight-info-'+inx" style="line-height:1rem;">
					{{flight}}
				</div>
			</template>
			<template v-slot:[`item.cost`]="{ item }">				
				$ {{ item.cost | currency}}
			</template>	
			<template v-slot:[`item.reconciled`]="{ item }">
				<div class="text-center">				
					<v-icon color="success" v-if="item.reconciled">mdi-checkbox-marked</v-icon>
					<v-icon color="warning" v-else>mdi-close-box</v-icon>
				</div>
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
						:error="periodErr"
						@change="periodErr=false"
						v-model="period"
						:items="periodOptions"
						outlined>
					</v-select>					
				</v-card-text>

				<v-card-actions>
					<v-btn color="grey darken-5" @click="reconcileDialog = false"> Cancel </v-btn>
					<v-btn class="ml-auto" :loading="savingData" color="green darken-1" @click="addPeriod"> Reconcile </v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import Vue from "vue";
import { ExportToCsv } from 'export-to-csv';

import { FLIGHT_RECONCILE_URL } from "../../../../urls";
import { securePost } from "../../../../store/jwt";
export default {	
	name: "UnReconciledFlights",
	props: {
		unReconciledFlights: {}
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
			savingData: false,
			period: null,
			periodErr:false,
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
			this.period = null;
			this.periodErr =false;
			this.savingData= false;
			this.reconcileDialog = true;
		},

		addPeriod(){
			if(!this.period){
				this.periodErr = true
				return
			}
			console.log(this.selectedFlights)
			this.savingData = true;
			const body = []
			for(const flight of this.selectedFlights){
				const reconcile = {
					invoiceID: flight.invoiceID, 
					invoiceDetailID: flight.invoiceDetailID,
					reconciled: true,
					reconcilePeriod: this.period,
				}
				if(flight.reconcileID) reconcile.reconcileID = flight.reconcileID;
				body.push(reconcile)
			}

			securePost(`${FLIGHT_RECONCILE_URL}/`, body)
			.then(() => {
				this.savingData = false;
				this.reconcileDialog = false;
				this.updateTable();
			})
			.catch(e => {
				this.savingData = false;
				console.log(e);
			});
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
					travelerFirstName: flight.travelerFirstName? flight.travelerFirstName:'',
					travelerLastName: flight.travelerLastName? flight.travelerLastName:'',
					reconciled: flight.reconciled? 'Yes':'No'					
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
				headers: ['Purchase Date', 'Cost', 'Agent', 'Airline', 'Flight Info', 'Final Destination', 'Department', 'Traveler First Name', 'Traveler last Name', 'Reconciled']
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
