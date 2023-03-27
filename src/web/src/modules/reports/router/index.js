const routes = [
	{
		path: "/reporting-summary",
		component: () => import("@/layouts/Layout"),
		children: [
			{
				name: "ReportsHome",
				path: "",
				meta: {
					requiresAuth: true
				},
				component: () => import("../views/Reports.vue")
			}
		]
	}
];

export default routes;