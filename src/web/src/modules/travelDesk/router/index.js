const routes = [
  {
    path: "/travel-request",
    component: () => import("@/layouts/BlankLayout"),
    children: [
      {
        name: "TravelDeskHome",
        path: "",
        meta: {
          requiresAuth: false
        },
        component: () => import("../views/TravelDesk.vue")
      }
    ]
  }
];

export default routes;
