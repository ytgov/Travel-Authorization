<template>
	<div>
		<v-dialog v-model="uploadPnrDialog" persistent  max-width="650px" >
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
				</v-card-title>

				<v-card-text>

					<v-row class="mx-0 mt-5">
						<v-col cols="6">
							<v-text-field																
								:error="invoiceNumberErr"
								@input="invoiceNumberErr=false"									
								label="Invoice Number"
								v-model="invoiceNumber"								
								outlined/>
						</v-col>
						<v-col cols="6">
							<v-select								
								:items="travelAgentsInfo"
								item-text="agencyName"
								item-value="agencyID"										
								label="Assign Agent"
								v-model="travelRequest.agencyID"								
								outlined />
						</v-col>
					</v-row>

					<v-row class="mx-0 mt-1 mb-5" align="center" justify="center">
						<v-col cols="4">
							<v-btn color="primary" elevation="5" @click="uploadDocument">
								Upload PNR Document
								<input
								id="inputfile"
								type="file"
								style="display: none"
								accept="application/pdf,image/x-png,image/jpeg"
								@change="handleSelectedFile"
								onclick="this.value=null;"
								/>
							</v-btn>
						</v-col>
						<v-col cols="1" />
						<v-col :key="update" class="blue--text text-h6 text-decoration-underline" cols="7">
							<a v-if="reader.result" :href="reader.result" download="UploadedFile.pdf" target="_blank">{{
								approvalFileName
							}}</a>
						</v-col>
					</v-row>

					<v-alert v-model="alert" dense color="red darken-4" dark dismissible>
						{{ alertMsg }}
					</v-alert>
							
					<v-row class="mx-0 mt-15 mb-2">
						<v-btn 
							color="grey darken-5" 
							class="my-0 ml-1 px-5" 
							:loading="savingData" 
							@click="closeModal()"
							>Close
						</v-btn>					
						
						<v-btn                                     
							@click="saveDocument()"							
							color="success"
							class="ml-auto mr-1 my-0 px-5"
							:loading="savingData"
							>Save 
						</v-btn>						
					</v-row>

				</v-card-text>
			</v-card>			
		</v-dialog>			
	</div>
</template>

<script>
	// import Vue from "vue";	
	import { TRAVEL_DESK_URL } from "../../../../../urls"
	import { securePost } from '../../../../../store/jwt';

	export default {		
		name: "UploadPnrModal",
		components: {
			
		},
		props: {		
			travelAgentsInfo: {},
			travelRequest:{}
		},
		data() {
			return {
				uploadPnrDialog:false,
				invoiceNumberErr:false,			
				invoiceNumber: "",
				alert: false,
				alertMsg: "",
				savingData: false,
				update: 0,
				reader: new FileReader(),
			};
		},
		mounted() {			
		},
		methods: {			
			async initForm(){								
				this.savingData=true
				this.invoiceNumberErr=false
				this.invoiceNumber=""
				this.reader = new FileReader()
				this.savingData=false
			},

			uploadDocument() {
				this.alert = false;
				const el = document.getElementById("inputfile");
				if (el) el.click();
			},

			handleSelectedFile(event) {
				event.preventDefault();
				event.stopPropagation();

				if (event.target.files && event.target.files[0]) {
					const file = event.target.files[0];

					this.approvalFileType = file.type;
					this.approvalFileName = file.name;

					this.reader.onload = () => {
					this.update++;
					};
					this.reader.readAsDataURL(file);
				}
			},

			saveDocument() {
				this.alert = false;

				if (this.checkStates()) {
					if (!this.reader?.result || this.approvalFileType != "application/pdf") {
						this.alertMsg = "Please upload the PNR PDF file.";
						this.alert = true;
						return;
					}
					const requestID = this.travelRequest.requestID
					this.savingData = true;
					const data = {						
						invoiceNumber: this.invoiceNumber,
						agencyID: this.travelRequest.agencyID
					};
					const bodyFormData = new FormData();
					bodyFormData.append("file", this.reader.result);
					bodyFormData.append("data", JSON.stringify(data));

					const header = {
						responseType: "application/pdf",
						headers: {
							"Content-Type": "multipart/form-data"
						}
					};

					securePost(`${TRAVEL_DESK_URL}/pnr-document/${requestID}`, bodyFormData, header)
					.then(() => {
						this.savingData = false;
						this.closeModal();
					})
					.catch(e => {
						this.savingData = false;
						console.log(e.response.data);
						this.alertMsg = e.response.data;
						this.alert = true;
					});
				}
			},

		
			checkStates(){
				this.invoiceNumberErr = this.invoiceNumber? false : true
				return (!this.invoiceNumberErr)
			},
			

			closeModal(){				
				this.uploadPnrDialog=false				
            },

		}
	};
</script>

<style scoped>
</style>