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
  }
];

export default routes;
