const routes = [
  {
    path: "/my-travel-requests",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        name: "TravelFormList",
        path: "",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/TravelFormList")
      },
      {
        path: "create",
        component: () => import("../views/TravelFormCreate"),
        children: [
          {
            path: "",
            redirect: "details",
          },
          {
            path: "details",
            name: "TravelFormCreate-DetailsTab",
            component: () => import("../views/travel-form-create/DetailsTab"),
          },
          {
            path: "estimate",
            name: "TravelFormCreate-EstimateTab",
            component: () => import("../views/travel-form-create/EstimateTab"),
          }
        ]
      },
      {
        name: "TravelFormEdit",
        path: ":formId",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/TravelFormEdit"),
        props: true,
      },
      {
        name: "TravelFormManagerList",
        path: "/managerView",
        meta: {
          requiresAuth: true
        },
        component: () => import("../views/ManagerView")
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
