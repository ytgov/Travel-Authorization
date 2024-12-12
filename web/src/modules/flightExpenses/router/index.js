const routes = [
  {
    path: "/flight-expense",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        name: "FlightExpenseHome",
        path: "",
        component: () => import("../views/FlightExpense.vue"),
      },
    ],
  },
]

export default routes
