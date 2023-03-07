<template>
	<div>
		<v-dialog v-model="travelAgentsDialog" persistent  max-width="650px" >
			<template v-slot:activator="{ on, attrs }">
				<v-btn					
					size="x-small"					
					style="min-width:0;"					
					color="blue lighten-2"					
					@click="initForm()"
					v-bind="attrs"
					v-on="on">
					<div class=" px-2">Upload PNR</div>		
				</v-btn>
			</template>
			
			<v-card>
				<v-card-title class="primary" style="border-bottom: 1px solid black">
					<div class="text-h5"> 
						Upload PNR						
					</div>
					<v-btn color="grey darken-5" class="my-0 ml-auto px-5" :loading="savingData" @click="closeModal()">						
						<div>Close</div>
					</v-btn>
				</v-card-title>

				<v-card-text>
					<v-row class="mt-5">
						<v-col cols="12">
							<title-card class="mt-5" titleWidth="10rem" >
								<template #title>
									<div>Agency Information</div>
								</template>										
								<template #body>									
									<v-textarea
										class="mx-5 mt-5"
										:error="state.agencyInfoErr"
										@input="state.agencyInfoErr=false"
										label="Paste Travel Agency Information Here"
										v-model="agencyInfo"
										rows="10"
										clearable		
										outlined/>
								</template>
							</title-card>							
						</v-col>
					</v-row>

					<v-row class="mt-5">
						<v-col cols="8">
							<v-text-field
								v-if="newAgency"																
								:error="state.agencyNameErr"
								@input="state.agencyNameErr=false"									
								label="Agency Name"
								v-model="agencyName"								
								outlined/>								
							<v-select
								v-else
								:items="travelAgentsInfo"
								item-text="agencyName"
								item-value="agencyID"
								:error="state.agencyNameErr"
								@input="agentSelected"
								label="Assign Agent"
								v-model="agencyID"								
								outlined />
						</v-col>
						<v-col cols="4">
							<v-btn
								v-if="!newAgency"				
								style="min-width:0;"					
								color="primary"					
								@click="agencyName=''; newAgency=true;"
								> Add New Agent									
							</v-btn>
							<v-btn
								v-else													
								style="min-width:0;"					
								color="primary"					
								@click="agencyName=''; newAgency=false;"
								> Cancel New Agent									
							</v-btn>
						</v-col>
					</v-row>
							
					<v-row class="mx-0">						
						<v-btn  
							:disabled="agencyID==0"                
							@click="deleteTravelAgent()"
							style="min-width: 0"
							color="red"
							class="ml-3 my-5 px-3 py-4"
							:loading="savingData"
							small>Delete
						</v-btn>						
						<v-btn                                     
							@click="saveTravelAgent()"
							style="min-width: 0"
							color="success"
							class="ml-auto mr-3 my-5 px-3 py-4"
							:loading="savingData"
							small>Save 
						</v-btn>						
					</v-row>

				</v-card-text>
			</v-card>
		</v-dialog>			
	</div>
</template>

<script>
	// import Vue from "vue";
	import TitleCard from '../../Common/TitleCard.vue'	
	import { TRAVEL_DESK_URL } from "../../../../../urls"
	import { secureGet, securePost, secureDelete } from '../../../../../store/jwt';

	export default {		
		name: "TravelAgentsModal",
		components: {
			TitleCard,
		},
		props: {			
		},
		data() {
			return {
				travelAgentsDialog:false,				
				portText:"",				
				state:{
					agencyNameErr:false,
					agencyInfoErr:false,
					newAgencyNameErr:false
				},
				travelAgentsInfo: [],
				agencyID: 0,
				agencyName: "",
				agencyInfo: "",
				savingData: false,
				newAgency: false,
			};
		},
		mounted() {			
		},
		methods: {			
			async initForm(){				
				// console.log()
				this.savingData=true
				
				this.state.agencyNameErr=false
				this.state.agencyInfoErr=false
				this.agencyName=""
				this.agencyInfo=""
				this.agencyID=0
				this.newAgency=false

				this.travelAgentsInfo = await this.getTravelAgentsInfo()
				this.savingData=false
			},

			async getTravelAgentsInfo() {				
				return secureGet(`${TRAVEL_DESK_URL}/travel-agents/`)
					.then(resp => {						
						return(resp.data)
					})
					.catch(e => {
						console.log(e);
					});
			},

			deleteTravelAgent(){
				this.savingData=true
				secureDelete(`${TRAVEL_DESK_URL}/travel-agents/${this.agencyID}`)
                    .then(resp => {
						console.log(resp)						
						//this.savingData=false                 
						this.initForm()
                })
                .catch(e => {
                    console.log(e);
					this.savingData=false
                });                
            },

           
            saveTravelAgent(){
				if(this.checkStates()){

					this.savingData=true
					const body = {
						agencyName: this.agencyName,
						agencyInfo: this.agencyInfo
					};

					securePost(`${TRAVEL_DESK_URL}/travel-agents/${this.agencyID}`, body)
						.then(resp => {
							console.log(resp) 
							//this.savingData=false
							this.initForm()							
					})
					.catch(e => {
						console.log(e);
						this.savingData=false
					});
				}
            },

			checkStates(){
				this.state.agencyNameErr = this.agencyName? false : true
				this.state.agencyInfoErr = this.agencyInfo? false : true
				return (!this.state.agencyNameErr && !this.state.agencyInfoErr)
			},

			agentSelected(){
				const selectedAgency = this.travelAgentsInfo.filter(agency=> agency.agencyID == this.agencyID)[0]
				if(selectedAgency){
					this.agencyInfo = selectedAgency.agencyInfo
					this.agencyName = selectedAgency.agencyName
				}
				this.state.agencyNameErr=false
			},

			closeModal(){				
				this.travelAgentsDialog=false				
            },

		}
	};
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">
.label {
	font-weight: 600;
	font-size: 10pt !important;
}
</style>