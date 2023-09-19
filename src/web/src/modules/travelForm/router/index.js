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
        component: () => import("../views/ManagerView")
      },
      {
        name: "travelRequestsList",
        path: "",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/FormList")
      },
      {
        name: "travelRequestCreate",
        path: "create",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/TravelFormCreate")
      },
      {
        name: "travelRequestEdit",
        path: ":formId",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/TravelFormEdit")
      },
      {
        name: "travelRequestManage",
        path: "request/:formId?/manage",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/TravelFormManage")
      }
    ]
  }
];

export default routes;
