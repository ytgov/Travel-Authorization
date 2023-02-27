<template>
	<div>
		<v-dialog v-model="transportationDialog" persistent max-width="80%">
			<template v-slot:activator="{ on, attrs }">
				<v-btn	
					:class="type=='Add New'? 'my-4 right':'mx-0 px-0'"					
					:color="type=='Add New'? 'primary':'transparent'"
					style="min-width: 0;"
					@click="initForm()"
					v-bind="attrs"
					v-on="on">
					<div v-if="type=='Add New'" >Add Transportation</div>
					<v-icon v-else class="mx-0 px-0" color="blue">mdi-pencil</v-icon>
				</v-btn>
			</template>

			<v-card>
				<v-card-title class="blue">
					<div class="text-h5">
						Add Transportation
					</div>
				</v-card-title>

				<v-card-text>					
					<v-row class="mt-5 mx-0">
						<v-col cols="3">
							<v-select
								:items="requestList"															
								:error="state.transportationTypeErr"								
								label="Request Type:"
								v-model="otherTransportationRequest.transportationType"								
								outlined/>		
						</v-col>
						<v-col cols="9">
						</v-col>											
					</v-row>
					<v-row class="mt-0 mx-0">
						<v-col cols="3">
							<v-text-field								
								:error="state.departErr"
								v-model="otherTransportationRequest.depart"								
								label="Depart"
								outlined/>
						</v-col>
						<v-col cols="3">
							<v-text-field								
								:error="state.arriveErr"
								v-model="otherTransportationRequest.arrive"
								label="Arrive"
								outlined/>
						</v-col>
						<v-col cols="2">
							<v-text-field
								:readonly="readonly"
								:error="state.dateErr"
								v-model="date"
								@input="state.dateErr = false"
								label="Date"
								outlined
								type="date"/>
						</v-col>
						<v-col cols="4">
							<v-textarea								
								:error="state.additionalNotesErr"
								v-model="otherTransportationRequest.additionalNotes"
								label="Additional Information"
								outlined/>	
						</v-col>				
					</v-row>
				</v-card-text>

				<v-card-actions>
					<v-btn color="grey darken-5" @click="transportationDialog = false">
						<div v-if="type == 'View'">Close</div>
						<div v-else>Cancel</div>
					</v-btn>					
					<v-btn						
						class="ml-auto"
						color="green darken-1"
						@click="saveTransportationRequest()"
						>
						<div v-if="type == 'View'">Save</div>
						<div v-else>Add</div>
					</v-btn>					
				</v-card-actions>
			</v-card>
		</v-dialog>
		
	</div>
</template>

<script>
	

	export default {		
		name: "NewTransportationRequest",
		props: {
			type: {
				type: String
			},
			otherTransportationRequest: {}
		},
		data() {
			return {
				date: "",				
				transportationDialog: false,
				requestList: ["Shuttle", "Bus", "Train"],				
				readonly: false,
				state: {
					transportationTypeErr: false,
					departErr: false,
					arriveErr: false,			
					dateErr: false,
					additionalNotesErr: false					
				},

			};
		},
		mounted() {			
		},
		methods: {

			checkFields() {
				this.state.transportationTypeErr = this.otherTransportationRequest.transportationType? false:true;
				this.state.departErr = this.otherTransportationRequest.depart?false:true;
				this.state.arriveErr = this.otherTransportationRequest.arrive?false: true;				
				this.state.dateErr = this.date?false: true;				
				this.state.additionalNotesErr = false;// 

				for (const key of Object.keys(this.state)) {
					if (this.state[key]) return false;
				}
				return true;
			},

			saveTransportationRequest() {
				if (this.checkFields()) {

					this.otherTransportationRequest.date=this.date+'T00:00:00.000Z';					
					this.$emit("updateTable",this.type)
					this.transportationDialog= false;						
				}
			},

			initForm() {

				this.initStates();

				if(this.type == "Add New"){

					this.otherTransportationRequest.transportationType="";
					this.otherTransportationRequest.depart="";
					this.otherTransportationRequest.arrive="";	
					this.otherTransportationRequest.additionalNotes="";
					this.otherTransportationRequest.status="Requested";//, Reserved"
					this.date="";

				} else {
					this.date=this.otherTransportationRequest.date.slice(0,10)
				}
								
			},

			initStates() {				
				for (const key of Object.keys(this.state)) {
					this.state[key] = false;
				}
			}			

		}
	};
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">

</style>