const routes = [
	{
		path: "/flight-expense",
		component: () => import("@/layouts/BlankLayout"),
		children: [
			{
				name: "FlightExpenseHome",
				path: "",
				meta: {
					requiresAuth: true
				},
				component: () => import("../views/FlightExpense.vue")
			}
		]
	}
];

export default routes;