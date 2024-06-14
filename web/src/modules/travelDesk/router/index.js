const routes = [
  {
    path: "/travel-desk",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        name: "TravelDesk",
        path: "",
        component: () => import("@/modules/travelDesk/views/TravelDesk.vue"),
      },
    ],
  },
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
