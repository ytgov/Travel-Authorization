const routes = [
  {
    path: "/travel-desk",
    component: () => import("@/layouts/BlankLayout"),
    children: [
      {
        name: "TravelDeskHome",
        path: "",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/TravelDesk.vue")
      }
    ]
  },
  {
    path: "/travel-request",
    component: () => import("@/layouts/BlankLayout"),
    children: [
      {
        name: "TravelRequestHome",
        path: "",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/TravelRequest.vue")
      }
    ]
  }
];

export default routes;
