const routes = [
  {
    path: "/preapproved",
    component: () => import("@/layouts//BlankLayout"),
    children: [
      {
        name: "PreApprovedTravelHome",
        path: "",
        meta: { requiresAuth: true },
        component: () => import("../views/Preapproved.vue")
      }
    ]
  }
];

export default routes;
