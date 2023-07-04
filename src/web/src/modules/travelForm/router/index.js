const routes = [
  {
    path: "/my-travel-requests",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        name: "TravelFormManagerList",
        path: "/managerView",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/ManagerView.vue")
      },
      {
        name: "FormList",
        path: "",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/FormList.vue")
      },
      {
        name: "TravelForm",
        path: "/my-travel-requests/:formId?",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/TravelForm.vue")
      },
      {
        name: "TravelFormReview",
        path: "request/:formId?/manage",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/TravelForm.vue")
      }
    ]
  }
];

export default routes;
