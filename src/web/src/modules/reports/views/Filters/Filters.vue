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
					
					<v-row>
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
									:value="locationSubCategory" 
									v-model="selectedSubCategories[locationCategory]" 
									:label="locationSubCategory"/>
								
							</div>	
						</v-col>
					</v-row>				
															
				</template>
			</title-card>	

			<title-card class="mt-10" titleWidth="6rem">
				<template #title>
					<div>Department</div>
				</template>
				<template #body>
					<v-row style="height: 6rem;">

					</v-row>															
				</template>
			</title-card>	

		</div>	
		
	</v-card>
</template>

<script>

import TitleCard from  '@/modules/travelDesk/views/Common/TitleCard.vue'

export default {
	components: {
		TitleCard
	},
	name: "Filters",
	
	data() {
		return {
			location: {
				categories: ['Yukon Communities', 'Canada', 'International'],
				subCategories: {
					'Yukon Communities': ['Beaver Creek', 'Burwash Landing', 'Carmocks', 'Carcross', 'Dawson', 'Whitehorse'],
					'Canada': ['Alberta', 'British Columbia', 'Saskatchewan', 'Manitoba', 'Ontario'],
					'International': ['England', 'United States of Ameria']
				}
			},
			selectedCategories: [],
			selectedSubCategories: {'Yukon Communities': [],
									'Canada': [],
									'International': []
								},			
			loadingData: false,
			alertMsg: ""
		};
	},
	mounted() {	
		this.initFilters();			
	},
	methods: {

		initFilters() {

			this.selectedCategories = [];
			this.selectedSubCategories = {
				'Yukon Communities': [],
				'Canada': [],
				'International': []
			};
		},

		selectCategory($event, locationCategory) {			
			
			if (!$event.includes(locationCategory)){
				this.selectedSubCategories[locationCategory] = [];
			}
		}
		
		
	}
};
</script>