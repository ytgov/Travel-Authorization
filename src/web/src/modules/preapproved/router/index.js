const routes = [
  {
    path: "/preapproved",
    component: () => import("@/layouts/BlankLayout"),
    children: [
      {
        name: "PreApprovedTravelHome",
        path: "",
        meta: {
          requiresAuth: false
        },
        component: () => import("../views/Preapproved.vue")
      }
    ]
  }
];

export default routes;
