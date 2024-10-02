const routes = [
  {
    path: "/travel-request",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        name: "TravelRequest",
        path: "",
        component: () => import("@/modules/travelDesk/views/TravelRequest.vue"),
      },
    ],
  },
]

export default routes
