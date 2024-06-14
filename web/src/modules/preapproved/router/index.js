const routes = [
  {
    path: "/preapproved",
    component: () => import("@/layouts/Layout"),
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
