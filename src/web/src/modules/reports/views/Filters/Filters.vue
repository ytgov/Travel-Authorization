<template>
	<v-card :loading="loadingData" :disabled="loadingData" en class="px-5 pb-15">
		
		<div v-if="loadingData" class="mt-10" style="text-align: center">loading ...</div>
		<v-alert v-if="alertMsg" class="mt-5" type="warning">{{ alertMsg }}</v-alert>

		<div v-if="!loadingData">

			<title-card class="mt-10" titleWidth="4.5rem">
				<template #title>
					<div>Location</div>
				</template>
				<template #body>
					
					<v-row class="mx-0">
						<v-col v-for="(locationCategory, categoryInx) in location.categories" :key="categoryInx">
							
							<v-checkbox 
								multiple
								dense
								@change="selectCategory($event, locationCategory)"
								v-model="selectedCategories" 
								:value="locationCategory"
								:label="locationCategory"/>

							<div class="ml-5" v-if="selectedCategories.includes(locationCategory)">								
								<v-checkbox v-for="(locationSubCategory, inx) in location.subCategories[locationCategory]" :key="inx"
									multiple 
									dense
									@change="updateFilters"
									:value="locationSubCategory" 
									v-model="selectedSubCategories[locationCategory]" 
									:label="locationSubCategory"/>
								
							</div>	
						</v-col>
					</v-row>				
															
				</template>
			</title-card>	

			<title-card class="mt-10" titleWidth="6.5rem">
				<template #title>
					<div>Department</div>
				</template>
				<template #body>
					<v-row style="" class="mx-3 my-0"  v-for="rowInx of [...Array(numberOfDeptRows).keys()]"  :key="rowInx">						

						<v-col 
							style="margin: 0; padding: 0;"
							cols="3"
							v-for="(dept, deptInx) in departmentList.slice(rowInx*4, rowInx*4 + 4)" 
							:key="deptInx">							
							<v-checkbox 
								multiple
								style="font-size: 12px;"
								dense
								@change="updateFilters"
								v-model="selectedDepartments" 
								:value="dept"
								:label="dept"/>							
						</v-col>

					</v-row>															
				</template>
			</title-card>	

		</div>	
		
	</v-card>
</template>

<script>
import Vue from "vue";
import TitleCard from  '@/modules/travelDesk/views/Common/TitleCard.vue'

export default {
	components: {
		TitleCard
	},
	name: "Filters",
	props: {		
		flightReport: {
			type: []
		}
	},
	
	data() {
		return {
			location: {
				categories: ['Yukon', 'Canada', 'International'],
				subCategories: {
					'Yukon': [],
					'Canada': [],
					'International': []
				}
			},
			selectedCategories: [],
			selectedSubCategories: {'Yukon': [],
									'Canada': [],
									'International': []
								},			
			loadingData: false,
			alertMsg: "",
			departmentList: [],
			selectedDepartments: [],
			numberOfDeptRows: 0
		};
	},
	mounted() {	
		this.initDepartments();		
		this.initLocations();
		this.initFilters();			
	},
	methods: {

		initFilters() {

			this.selectedCategories = [];
			this.selectedSubCategories = {
				'Yukon': [],
				'Canada': [],
				'International': []
			};
			this.selectedDepartments = [];
		},

		initDepartments() {
			const existingDepartments = this.flightReport.map(flight => flight.dept);
			this.departmentList = [...new Set(existingDepartments)];	
			this.numberOfDeptRows = Math.ceil(this.departmentList.length/4);
		},		

		initLocations() {
			const CanadianProvinces= ['BC','ON','QC','AB','SK','MB','NL','PE','NS','NB','YT','NT','NU'] 
			const existingProvinces = this.flightReport.map(flight => flight.finalDestinationProvince);
			const provinces = [...new Set(existingProvinces)]

			const yukonFlights = this.flightReport.filter(flight => flight.finalDestinationProvince=='YT');
			const existingYukonCities = yukonFlights.map(flight => flight.finalDestinationCity);

			this.location.subCategories.Yukon = [...new Set(existingYukonCities)]
			this.location.subCategories.Canada = provinces.filter(prv => CanadianProvinces.includes(prv));
			this.location.subCategories.International = provinces.filter(prv => !CanadianProvinces.includes(prv));			
		},	

		selectCategory($event, locationCategory) {			
			
			if (!$event.includes(locationCategory)){
				this.selectedSubCategories[locationCategory] = [];
			}
			this.updateFilters();
		},

		updateFilters() {
			Vue.nextTick(() => {
				this.$emit("updateFilters", this.selectedDepartments, this.selectedSubCategories);
			});	
		}		
		
	}
};
</script>