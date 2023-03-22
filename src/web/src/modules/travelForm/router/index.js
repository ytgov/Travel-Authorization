const routes = [
  {
    path: "/TravelRequest",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        name: "TravelFormList",
        path: "",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/FormList.vue")
      },
      {
        name: "TravelForm",
        path: "Request/:formId?",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/TravelForm.vue")
      },
      {
        name: "TravelFormReview",
        path: "Request/:formId?/:manage?",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/TravelForm.vue")
      },
      {
        name: "TravelFormManagerList",
        path: "/managerView",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/ManagerView.vue")
      }
    ]
  }
];

export default routes;
