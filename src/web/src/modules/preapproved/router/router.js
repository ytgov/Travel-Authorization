const routes = [
  {
    path: "/preapproved",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        name: "Home",
        path: "",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/Preapproved")
      }
    ]
  }
];

export default routes;
