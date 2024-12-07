const routes = [
  {
    path: "/preapproved",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        name: "PreApprovedTravelHome",
        path: "",
        component: () => import("../views/Preapproved.vue"),
      },
    ],
  },
]

export default routes
