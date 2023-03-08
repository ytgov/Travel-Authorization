<template>
	<div>
		<v-dialog v-model="submitTravelDialog" persistent max-width="950px">
		<template v-slot:activator="{ on, attrs }">
			<v-btn
			:id="'edit-' + preTSubID"
			:disabled="disabled"
			:small="editButton"
			:class="editButton ? 'my-0' : 'mr-5 my-7'"
			elevation="5"
			color="primary"
			@click="extractTravelRequests()"
			v-bind="attrs"
			v-on="on"
			>
			{{ buttonName }}
			</v-btn>
		</template>

		<v-card :key="update">
			<v-card-title style="border-bottom: 1px solid black">
			<div class="text-h5">Submit/Draft Travel Request</div>
			</v-card-title>

			<v-card-text>
			<v-row class="mt-3">
				<v-btn class="ml-auto mr-5" color="primary" @click="openAddTravel"> Add Request </v-btn>
			</v-row>
			<v-data-table
				style="margin-top: 1rem"
				:headers="headers"
				:items="submittingRequests"
				:items-per-page="5"
				class="elevation-1"
				hide-default-footer
			>
				<template v-slot:[`item.remove`]="{ item }">
				<v-btn @click="removeTravel(item)" style="min-width: 0" color="transparent" class="px-1" small>
					<v-icon color="red">mdi-delete</v-icon>
				</v-btn>
				</template>
				<template v-slot:[`item.name`]="{ item }">
				<v-tooltip top color="primary">
					<template v-slot:activator="{ on }">
					<div v-on="item.travelers.length > 1 ? on : ''">
						<span>
						{{ item.travelers[0].fullName.replace(".", " ") }}
						</span>
						<span v-if="item.travelers.length > 1">, ... </span>
					</div>
					</template>
					<span
					><div v-for="(trv, inx) in item.travelers" :key="inx">
						{{ trv.fullName.replace(".", " ") }}
					</div></span
					>
				</v-tooltip>
				</template>
				<template v-slot:[`item.status`]="{ item }">
				<v-tooltip top color="amber accent-4">
					<template v-slot:activator="{ on }">
					<v-icon
						style="cursor: pointer"
						v-on="on"
						v-if="item.status && item.preTSubID != preTSubID"
						class=""
						color="amber accent-2"
						>mdi-alert</v-icon
					>
					</template>
					<span class="black--text">
					This request is already in another submission.<br />
					If you Save/Submit this change, it will be removed from the other submission.
					</span>
				</v-tooltip>
				</template>
				<template v-slot:[`item.edit`]="{ item }">
				<new-travel-request type="Edit" @updateTable="updateAndOpenDialog" :travelRequest="item" />
				</template>
			</v-data-table>
			</v-card-text>

			<v-card-actions>
			<v-btn color="grey darken-5" @click="submitTravelDialog = false"> Cancel </v-btn>
			<v-btn v-if="editButton" color="red darken-5" @click="deleteSubmission()"> Delete </v-btn>
			<v-btn class="ml-auto" color="lime darken-1" :loading="savingData" @click="submitTravelRequest('Draft')">
				Save Draft
			</v-btn>
			<v-btn class="ml-5" color="green darken-1" :loading="savingData" @click="submitTravelRequest('Submitted')">
				Submit
			</v-btn>
			</v-card-actions>
		</v-card>
		</v-dialog>

		<v-dialog v-model="addTravelDialog" persistent max-width="900px">
		<v-card>
			<v-card-title class="primary" style="border-bottom: 1px solid black">
			<div class="text-h5">Requests</div>
			</v-card-title>

			<v-card-text>
			<v-data-table
				:headers="addTravelHeaders"
				:items="remainingTravelRequests"
				:items-per-page="5"
				class="elevation-1 mt-5"
				v-model="newSelectedRequests"
				item-key="preTID"
				show-select
				single-select
			>
				<template v-slot:[`item.name`]="{ item }">
				<v-tooltip top color="primary">
					<template v-slot:activator="{ on }">
					<div v-on="item.travelers.length > 1 ? on : ''">
						<span>
						{{ item.travelers[0].fullName.replace(".", " ") }}
						</span>
						<span v-if="item.travelers.length > 1">, ... </span>
					</div>
					</template>
					<span
					><div v-for="(trv, inx) in item.travelers" :key="inx">
						{{ trv.fullName.replace(".", " ") }}
					</div></span
					>
				</v-tooltip>
				</template>

				<template v-slot:[`item.travelDate`]="{ item }">
				<div v-if="item.dateUnkInd">
					{{ item.month }}
				</div>
				<div v-else>
					<div>
					<!-- eslint-disable-next-line vue/no-parsing-error -->
					{{ item.startDate | beautifyDate }}
					to
					</div>
					<div>
					<!-- eslint-disable-next-line vue/no-parsing-error -->
					{{ item.endDate | beautifyDate }}
					</div>
				</div>
				</template>

				<template v-slot:[`item.status`]="{ item }">
				<div v-if="item.preTSubID != preTSubID">
					{{ item.status }}
				</div>
				</template>
			</v-data-table>
			</v-card-text>

			<v-card-actions>
			<v-btn color="grey darken-5" @click="addTravelDialog = false"> Cancel </v-btn>
			<v-btn class="ml-auto" color="green darken-1" @click="addTravel"> Add </v-btn>
			</v-card-actions>
		</v-card>
		</v-dialog>
	</div>
	</template>

	<script>
	import NewTravelRequest from "../Requests/NewTravelDeskRequest.vue";
	import { PREAPPROVED_URL } from "../../../../urls";
	import { securePost, secureDelete } from "@/store/jwt";

	export default {
	components: {
		NewTravelRequest
	},
	name: "SubmitTravel",
	props: {
		buttonName: {
		type: String
		},
		editButton: {
		type: Boolean,
		default: false
		},
		preTSubID: {
		type: Number,
		default: 0
		},
		travelRequests: {
		type: []
		},
		selectedRequests: {
		type: []
		},
		disabled: {
		type: Boolean,
		default: false
		}
	},
	data() {
		return {
		headers: [
			{
			text: "Name",
			value: "name",
			class: "blue-grey lighten-4"
			},
			{
			text: "Branch",
			value: "branch",
			class: "blue-grey lighten-4"
			},
			{
			text: "Reason",
			value: "reason",
			class: "blue-grey lighten-4"
			},
			{
			text: "Location",
			value: "location",
			class: "blue-grey lighten-4"
			},
			{
			text: "",
			sortable: false,
			value: "status",
			class: "blue-grey lighten-4",
			cellClass: "px-0 mx-0",
			width: "1rem"
			},
			{
			text: "",
			sortable: false,
			value: "remove",
			class: "blue-grey lighten-4",
			cellClass: "px-0 mx-0",
			width: "1rem"
			},
			{
			text: "",
			sortable: false,
			value: "edit",
			class: "blue-grey lighten-4",
			cellClass: "px-0 mx-0",
			width: "1rem"
			}
		],
		addTravelHeaders: [
			{
			text: "Name",
			value: "name",
			class: "blue-grey lighten-4"
			},
			{
			text: "Department",
			value: "department",
			class: "blue-grey lighten-4"
			},
			{
			text: "Branch",
			value: "branch",
			class: "blue-grey lighten-4"
			},

			{
			text: "Location",
			value: "location",
			class: "blue-grey lighten-4"
			},
			{
			text: "Purpose Type",
			value: "purpose",
			class: "blue-grey lighten-4"
			},
			// { text: 'Reason',       value: 'reason',      class: 'blue-grey lighten-4' },
			{
			text: "Status",
			value: "status",
			class: "blue-grey lighten-4",
			cellClass: "text-h6 red--text"
			}
		],
		submittingRequests: [],
		submitTravelDialog: false,
		newSelectedRequests: [],
		addTravelDialog: false,
		savingData: false,
		update: 0
		};
	},
	mounted() {},
	computed: {
		remainingTravelRequests() {
		const currentIDs = this.submittingRequests.map(req => req.preTID);
		const currentDept = this.submittingRequests[0]?.department;
		return this.travelRequests?.filter(
			req =>
			!currentIDs.includes(req.preTID) &&
			(req.status == null || req.status == "Draft") &&
			(req.department == currentDept || currentIDs.length == 0)
		);
		}
	},
	methods: {
		extractTravelRequests() {
		this.submittingRequests = JSON.parse(
			JSON.stringify(this.selectedRequests.filter(req => req.status == null || req.status == "Draft"))
		);
		},

		removeTravel(item) {
		this.submittingRequests = JSON.parse(
			JSON.stringify(this.submittingRequests.filter(travel => travel.preTID != item.preTID))
		);
		this.update++;
		},

		openAddTravel() {
		this.newSelectedRequests = [];
		this.addTravelDialog = true;
		},

		addTravel() {
		this.submittingRequests = [...this.submittingRequests, ...this.newSelectedRequests];
		this.addTravelDialog = false;
		},

		submitTravelRequest(type) {
		const currentIDs = this.submittingRequests.map(req => req.preTID);
		if (currentIDs.length > 0) {
			const currentDept = this.submittingRequests[0].department;
			this.savingData = true;
			const body = {
			department: currentDept,
			status: type,
			submitter: "SYSTEM",
			preapprovedIds: currentIDs
			};
			// console.log(body)
			securePost(`${PREAPPROVED_URL}/submissions/${this.preTSubID}`, body)
			.then(() => {
				this.savingData = false;
				this.submitTravelDialog = false;
				this.$emit("updateTable");
			})
			.catch(e => {
				this.savingData = false;
				console.log(e);
			});
		}
		},

		deleteSubmission() {
		secureDelete(`${PREAPPROVED_URL}/submissions/${this.preTSubID}`)
			.then(() => {
			this.savingData = false;
			this.submitTravelDialog = false;
			this.$emit("updateTable");
			})
			.catch(e => {
			this.savingData = false;
			console.log(e);
			});
		},

		updateTable() {
		this.$emit("updateTable");
		},

		updateAndOpenDialog() {
		this.$store.commit("preapproved/SET_OPEN_DIALOG_ID", "edit-" + this.preTSubID);
		this.updateTable();
		}
	}
	};
	</script>

	<style scoped>
	::v-deep(tbody tr:nth-of-type(even)) {
	background-color: rgba(0, 0, 0, 0.05);
	}
	</style>
