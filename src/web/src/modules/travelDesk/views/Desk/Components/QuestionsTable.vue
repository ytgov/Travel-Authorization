<template>
	<div>
		<div id="questions-table">Questions</div>
		<v-card class="questions-column mx-5 my-0" elevation="2" outlined>
			<v-row class="my-3 mx-3">
				<v-btn				
					class="ml-auto px-2"
					style="min-width: 0;"
					@click="newForm()"
					color="primary">
					<div>Add Question</div>					
				</v-btn>				
			</v-row>
			<v-row v-for="question,inx in questions" :key="'question-'+inx" class="mb-3 mt-0 mx-2">
				<v-col>
					<new-question class="mt-n10" :question="question" />				
				</v-col>
			</v-row>
		</v-card>					
	</div>
</template>

<script>

	import NewQuestion from "./NewQuestion.vue";

	export default {
		components: {			
			NewQuestion
		},
		name: "QuestionsTable",
		props: {
			readonly: Boolean,
			questions: {}
		},
		data() {
			return {
				tmpId:1,
				admin: false,
				savingData: false,
			};
		},
		mounted() {	
			this.initForm()					
		},
		methods: {
			// updateTable(type) {
				
			// 	// if(type=='Add New'){
			// 	// 	this.carRequest.tmpId=this.tmpId
			// 	// 	this.rentalCars.push(JSON.parse(JSON.stringify(this.carRequest)))
			// 	// 	this.tmpId++
			// 	// }
			// },	

			newForm(){
				const today = new Date()
				this.questions.push({
					creatingDate: today.toISOString(),
					question:"",
					response:"",
					requestType:"Hotel"
				})
			},
			
			initForm(){
				// const carRequest = {}
				// carRequest.rentalVehicleID=null
				// carRequest.tmpId=null
				// carRequest.pickUpCity=""
				// carRequest.pickUpLocation=""
				// carRequest.pickUpLocOther=""
				// carRequest.dropOffLocation= ""
				// carRequest.dropOffLocOther=""
				// carRequest.sameDropOffLocation=true
				// carRequest.matchFlightTimes=false
				// carRequest.pickUpDate=""
				// carRequest.dropOffDate=""
				// carRequest.vehicleType=""
				// carRequest.vehicleChangeRationale=""
				// carRequest.additionalNotes=""
				// carRequest.status="Requested"

				// this.carRequest = carRequest								
			},

			// editRentalCar(item) {				
			// 	// this.carRequest=item						
			// },

			// removeRentalCar(item) {
			// 	// console.log(item)
			// 	// let delIndex = -1
			// 	// if(item.rentalVehicleID>0)
			// 	// 	delIndex = this.rentalCars.findIndex(rentalCar => (rentalCar.rentalVehicleID && rentalCar.rentalVehicleID == item.rentalVehicleID) );
			// 	// else
			// 	// 	delIndex = this.rentalCars.findIndex(rentalCar => (rentalCar.tmpId && rentalCar.tmpId == item.tmpId));				
			// 	// console.log(delIndex)
			// 	// if(delIndex>=0) this.rentalCars.splice(delIndex,1)
			// }
		}
	};
</script>

<style scoped lang="css" src="@/styles/_travel_desk.css">

</style>