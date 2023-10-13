const routes = [
  {
    path: "/",
    component: () => import("@/layouts/BlankLayout"),
    children: [
      {
        name: "SignIn",
        path: "sign-in",
        component: () => import("../views/SignIn"),
      },
    ],
  },
];

export default routes;
