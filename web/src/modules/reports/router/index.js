const routes = [
  {
    path: "/reporting-summary",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        name: "ReportsHome",
        path: "",
        component: () => import("../views/Reports.vue"),
      },
    ],
  },
]

export default routes
