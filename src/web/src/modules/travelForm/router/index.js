const routes = [
  {
    path: "/my-travel-requests",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        name: "FormList",
        path: "",
        meta: {
          requiresAuth: true,
        },
        component: () => import("../views/FormList.vue"),
      },
      {
        name: "TravelForm",
        path: ":formId?",
        meta: {
          requiresAuth: true,
        },
        component: () => import("../views/TravelForm.vue"),
      },
      {
        name: "TravelFormReview",
        path: "Request/:formId?/:manage?",
        meta: {
          requiresAuth: true,
        },
        component: () => import("../views/TravelForm.vue"),
      },
      {
        name: "TravelFormManagerList",
        path: "/managerView",
        meta: {
          requiresAuth: true,
        },
        component: () => import("../views/ManagerView.vue"),
      },
    ],
  },
];

export default routes;
