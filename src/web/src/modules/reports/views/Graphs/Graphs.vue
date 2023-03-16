<template>
	<v-card :loading="loadingData" :disabled="loadingData" en class="px-5 pb-15">
		
		<div v-if="loadingData" class="mt-10" style="text-align: center">loading ...</div>
		<v-alert v-if="alertMsg" class="mt-5" type="warning">{{ alertMsg }}</v-alert>

		<div v-if="!loadingData">
			
			<v-row>
				<v-col style="margin: 5rem 0;" cols="8">

					<div  v-if="tabs == 0" id="chart">
						<apexchart type="pie" height="550" :options="pieChartOptions" :series="pieSeries"></apexchart>
					</div>

					<div v-else-if="tabs == 1" id="chart">
						<apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
					</div>

					<div v-else-if="tabs == 2" id="chart">
						<apexchart type="line" :options="chartOptions" :series="series"></apexchart>
					</div>

				</v-col>
				<v-col cols="4">

					<v-card style="border: 0px solid white !important;">

						<v-toolbar v-if="!loadingData" class="" height="20px" flat>						
							<template v-slot:extension>
								<v-tabs v-model="tabs" active-class="primary--text teal lighten-5" @change="selectTab()">
									<v-tab>Pie</v-tab>
									<v-tab>Bar</v-tab>
									<v-tab>Line</v-tab>
								</v-tabs>
							</template>
						</v-toolbar>

						<v-tabs-items v-if="!loadingData" v-model="tabs">
							<v-tab-item>

								<v-checkbox v-if="filtersApplied" v-model="filteredData" label="Use Filtered Data"									
									class="ml-4"
									value="true"
									hide-details/>
								<div class="my-3 ml-4">Group By</div>

								<v-card style="padding: 1.5rem;" class="mt-2 mx-4" flat>
									<v-row v-for="(pieGroup, pieGroupInx) in pieChartFilter.groupBy" :key="pieGroupInx">							
										<v-checkbox multiple dense @change="selectPieGroup($event, pieGroup)"
											v-model="pieChartSelectedGroupBy" 
											:value="pieGroup"
											:label="pieGroup"/>										
									</v-row>
								</v-card>

								<div class="my-3 ml-4">Show</div>

								<v-card style="padding: 1.5rem;" class="mt-2 mx-4" flat>
									<v-row v-for="(pieShow, pieShowInx) in pieChartFilter.show" :key="pieShowInx">							
										<v-checkbox multiple dense @change="selectPieShow($event, pieShow)"
											v-model="pieChartSelectedDisplayFields" 
											:value="pieShow"
											:label="pieShow"/>										
									</v-row>
								</v-card>

							</v-tab-item>
							<v-tab-item>

								<v-checkbox v-if="filtersApplied" v-model="filteredData" label="Use Filtered Data"									
									class="ml-4"
									value="true"
									hide-details/>
								<div class="my-3 ml-4">Group By</div>

								<v-card style="padding: 1.5rem;" class="mt-2 mx-4" flat>
									<v-row v-for="(barGroup, barGroupInx) in barChartFilter.groupBy" :key="barGroupInx">							
										<v-checkbox multiple dense @change="selectBarGroup($event, barGroup)"
											v-model="barChartSelectedGroupBy" 
											:value="barGroup"
											:label="barGroup"/>										
									</v-row>
								</v-card>

								<div class="my-3 ml-4">Show</div>

								<v-card style="padding: 1.5rem;" class="mt-2 mx-4" flat>
									<v-row v-for="(barShow, barShowInx) in barChartFilter.show" :key="barShowInx">							
										<v-checkbox multiple dense @change="selectBarShow($event, barShow)"
											v-model="barChartSelectedDisplayFields" 
											:value="barShow"
											:label="barShow"/>										
									</v-row>
								</v-card>

							</v-tab-item>
							<v-tab-item>

								<v-checkbox v-if="filtersApplied" v-model="filteredData" label="Use Filtered Data"									
									class="ml-4"
									value="true"
									hide-details/>
								<div class="my-3 ml-4">Group By</div>

								<v-card style="padding: 1.5rem;" class="mt-2 mx-4" flat>
									<v-row v-for="(lineGroup, lineGroupInx) in lineChartFilter.groupBy" :key="lineGroupInx">							
										<v-checkbox multiple dense @change="selectLineGroup($event, lineGroup)"
											v-model="lineChartSelectedGroupBy" 
											:value="lineGroup"
											:label="lineGroup"/>										
									</v-row>
								</v-card>

								<div class="my-3 ml-4">Show</div>

								<v-card style="padding: 1.5rem;" class="mt-2 mx-4" flat>
									<v-row v-for="(lineShow, lineShowInx) in lineChartFilter.show" :key="lineShowInx">							
										<v-checkbox multiple dense @change="selectLineShow($event, lineShow)"
											v-model="lineChartSelectedDisplayFields" 
											:value="lineShow"
											:label="lineShow"/>										
									</v-row>
								</v-card>

							</v-tab-item>
						</v-tabs-items>

					</v-card>

				</v-col>
			</v-row>		

		</div>	
		
	</v-card>
</template>

<script>

export default {
	
	name: "Graphs",
	props: {
		filtersApplied: {
			type: Boolean
		},
		flightReport: {
			type: []
		}
	},
	
	data() {
		return {	
			tabs: 0,
			pieSeries: [44, 55, 41, 17],
			pieChartOptions: {
				labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
			},			
			series: [{
				name: "Desktops",
				data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
			}],
			chartOptions: {
				chart: {
					height: 350,
					type: 'line',
					zoom: {
						enabled: false
					}
				},
				dataLabels: {
					enabled: false
				},
				stroke: {
					curve: 'straight'
				},
				title: {
					text: '',
					align: 'left'
				},
				grid: {
					row: {
						colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
						opacity: 0.5
					},
				},
				xaxis: {
					categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
				}
			},

			filteredData: false,			
			pieChartFilter: {
				groupBy: ['Destination City', 'Province', 'Department'],
				show: ['Total Trips', 'Total Expences', 'Total Flight Cost', 'Average Duration']
			},
			pieChartSelectedGroupBy: [],
			pieChartSelectedDisplayFields: [],
			
			lineChartFilter: {
				groupBy: ['Destination City', 'Province', 'Department'],
				show: ['Total Trips', 'Total Expences', 'Total Flight Cost', 'Average Duration']
			},
			lineChartSelectedGroupBy: [],
			lineChartSelectedDisplayFields: [],

			barChartFilter: {
				groupBy: ['Destination City', 'Province', 'Department'],
				show: ['Total Trips', 'Total Expences', 'Total Flight Cost', 'Average Duration']
			},
			barChartSelectedGroupBy: [],
			barChartSelectedDisplayFields: [],

			loadingData: false,
			alertMsg: ""
		};
	},
	mounted() {	
		this.initFilters();			
	},
	methods: {

		initFilters() {

			this.pieChartSelectedGroupBy = [];
			this.pieChartSelectedDisplayFields = [];

			this.barChartSelectedGroupBy = [];
			this.barChartSelectedDisplayFields = [];

			this.lineChartSelectedGroupBy = [];
			this.lineChartSelectedDisplayFields = [];
			
		},

		selectTab(){

			//console.log($event)
			console.log(this.tabs)

		},

		selectCategory($event, locationCategory) {			
			
			if (!$event.includes(locationCategory)){
				this.selectedSubCategories[locationCategory] = [];
			}
		},

		selectPieGroup($event, pieGroup){

			console.log($event.includes(pieGroup))

		},

		selectPieShow($event, pieShow){

			console.log($event.includes(pieShow))

		},

		selectBarGroup($event, barGroup){

			console.log($event.includes(barGroup))

		},

		selectBarShow($event, barShow){

			console.log($event.includes(barShow))

		},

		selectLineGroup($event, lineGroup){

			console.log($event.includes(lineGroup))

		},

		selectLineShow($event, lineShow){

			console.log($event.includes(lineShow))

		}
		
		
	}
};
</script>