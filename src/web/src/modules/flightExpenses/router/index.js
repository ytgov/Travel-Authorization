const routes = [
	{
		path: "/flight-expense",
		component: () => import("@/layouts/Layout"),
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