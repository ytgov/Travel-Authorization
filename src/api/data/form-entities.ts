export class dbForm {
	general: {} = {
		firstname: String,
		lastname: String,
		department: String,
		division: String,
		branch: String,
		unit: String,
		email: String,
		mailcode: String,
		travelduration: String,
		daysnottravel: String,
		datebacktowork: String,
		purpose: String,
		traveladvance: String,
		eventname: String,
		summary: String,
		supervisoremail: String,
		formstatus: String,
	};
	stops: [{}] = [
		{
			travelFrom: String,
			travelTo: String,
			departureTime: String,
			departureDate: String,
			transport: String,
			estimate: String,
		},
	];
}
