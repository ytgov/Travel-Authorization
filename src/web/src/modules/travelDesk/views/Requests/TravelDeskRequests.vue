<template>
	<div class="mx-10 mb-5">	
		<v-row class="my-0 mx-0">
      
			<print-report
				v-if="admin"
				:disabled="selectedRequests.length == 0"
				:travelRequests="selectedRequests"
				buttonName="Print Report"
			/>
			<v-btn
				v-if="admin"
				:disabled="selectedRequests.length == 0"        
				@click="exportToExcel()"          
				class="mr-5 my-7"
				elevation="5"
				color="primary"          
				>
				Export To Excel
			</v-btn>
		
		</v-row>	
		<v-data-table
			:headers="headers"
			:items="grayedOutTravelRequests"
			:items-per-page="5"
			class="elevation-1"
			v-model="selectedRequests"
			item-key="preTID"
			:show-select="admin"
			@item-selected="applySameDeptSelection"
			@toggle-select-all="applyAllSameDeptSelection">			

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
					:type="item.status=='Approved'?((item.phase == 'Travel Approved')?'Submit': 'Review'):''"
					@updateTable="updateTable"
					:travelRequest="item"/>
			</template>
		</v-data-table>
	</div>
</template>

<script>
	import Vue from "vue";
	import NewTravelDeskRequest from "./NewTravelDeskRequest.vue";
	import PrintReport from "../Common/PrintTravelDeskReport.vue";	
	import { ExportToCsv } from 'export-to-csv';

	export default {
		components: {
			NewTravelDeskRequest,
			PrintReport
		},
		name: "TravelDeskRequests",
		props: {
			travelRequests: {
				type: []
			}
		},
		data() {
			return {
				headers: [				
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
				admin: true,//
				selectedRequests: [],
				firstSelectionDept: ""
			};
		},
		mounted() {
			this.admin = Vue.filter("isAdmin")();
		},
		computed: {
			grayedOutTravelRequests() {
				const travelRequests = JSON.parse(JSON.stringify(this.travelRequests));
				if(this.firstSelectionDept)
					travelRequests.forEach(req => {
						req.isSelectable= req.isSelectable? (req.department==this.firstSelectionDept) :false
					});
				return travelRequests
			}
		},
		methods: {
			updateTable() {
				this.$emit("updateTable");
			},
			applySameDeptSelection(selection) {
				Vue.nextTick(() => {
					if (this.selectedRequests.length == 1) {
						this.firstSelectionDept = this.selectedRequests[0].department;
					} else if (this.selectedRequests.length == 0) {
						this.firstSelectionDept = "";
					}

					if (selection.value == true && selection.item.department != this.firstSelectionDept) {
						this.selectedRequests = this.selectedRequests.filter(req => req.preTID != selection.item.preTID);
					}
				});
			},
			applyAllSameDeptSelection(selection) {
				console.log(selection);
				Vue.nextTick(() => {
					if (selection.value == true && this.firstSelectionDept) {
						this.selectedRequests = this.selectedRequests.filter(req => req.department == this.firstSelectionDept);
					} else {
						this.selectedRequests = [];
						this.firstSelectionDept = "";
					}
				});
			},
			exportToExcel(){
			// console.log(this.selectedRequests)
				const csvInfo = this.selectedRequests.map(req =>{
					return {
					travelers: req.travelers?.map(trv=>trv.fullName.replace(".", " "))?.join(', '),
					department: req.department,
					branch: (req.branch? req.branch:''),
					travelDate: (req.dateUnkInd? req.month:(req.startDate +' '+ req.endDate)),
					location: req.location,          
					purpose: (req.purpose? req.purpose :''),
					estimatedCost: req.estimatedCost,
					reason: (req.reason? req.reason :''),
					status: (req.status? req.status :''),
					travelerNotes: (req.travelerNotes? req.travelerNotes :'')
					}
				})
				const options = { 
					fieldSeparator: ',',
					quoteStrings: '"',
					decimalSeparator: '.',
					showLabels: true, 
					showTitle: false,
					title: '',
					filename: 'Preapproved-Travel-Requests',
					useTextFile: false,
					useBom: true,
					useKeysAsHeaders: false,
					headers: ['Name', 'Department', 'Branch', 'Travel Date', 'Location', 'Purpose', 'Estimated Cost', 'Reason', 'Status', 'Notes']
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
