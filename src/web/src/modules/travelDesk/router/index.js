const routes = [
  {
    path: "/traveldesk",
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
