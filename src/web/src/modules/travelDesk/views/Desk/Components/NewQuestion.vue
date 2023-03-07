<template>
	<div>
		<title-card class="mt-10" titleWidth="6rem" >
            <template #title>
                <div>Question</div>
            </template>
            <template #body>

				<v-row class="mt-3 mb-0 mx-0">
					<v-col cols="8">
						<v-select
							:readonly="!travelDeskUser || readonly"
							:items="questionList"		
							label="About"
							v-model="question.requestType"								
							outlined/>		
					</v-col>											
				</v-row>

				<v-row class="my-n10 mx-0">
					<v-col cols="12">
						<v-text-field
							:readonly="!travelDeskUser || readonly"								
							:error="question.state.questionErr"
							@input="question.state.questionErr=false"								
							label="Question"
							v-model="question.question"								
							outlined/>
					</v-col>
				</v-row>

				<v-row class="my-n5 mx-0">
					<v-col cols="12">
						<v-text-field
							:readonly="readonly"							
							:error="question.state.responseErr"
							@input="question.state.responseErr=false"								
							label="Response"
							v-model="question.response"								
							outlined/>
					</v-col>
				</v-row>
			</template>
		</title-card>
	</div>
</template>

<script>
	// import Vue from "vue";
	import TitleCard from '../../Common/TitleCard.vue'

	export default {
		components: {	 
            TitleCard,            
        },		
		name: "NewQuestion",
		props: {
			readonly: { type: Boolean, default:false },			
			question: {},
			travelDeskUser: { type: Boolean, default: false },			
		},
		data() {
			return {
				questionList: ["Flight", "Hotel", "Rental Car", "Transportation"],				
			};
		},
		mounted() {			
		},
		methods: {			
			// checkFields() {				
			// 	return true;
			// },
		}
	};
</script>

<style scoped >

</style>