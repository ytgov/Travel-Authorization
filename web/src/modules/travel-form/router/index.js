const routes = [
  {
    path: "/my-travel-requests",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        name: "TravelFormList",
        path: "",
        meta: {
          requiresAuth: true,
        },
        component: () => import("../views/TravelFormList"),
      },
      {
        path: ":formId",
        component: () => import("@/modules/travel-form/pages/TravelAuthorizationRead"),
        props: true,
        children: [
          {
            path: "",
            redirect: "details",
          },
          {
            path: "details",
            name: "TravelAuthorizationRead-DetailsTab",
            component: () => import("@/modules/travel-form/pages/travel-authorization-read/DetailsTab"),
            props: true,
          },
        ],
      },
      {
        path: ":formId/edit",
        component: () => import("../views/TravelFormEdit"),
        props: true,
        children: [
          {
            path: "",
            redirect: "details",
          },
          {
            path: "details",
            name: "TravelFormEdit-DetailsTab",
            component: () => import("../views/travel-form-edit/DetailsTab"),
            props: true,
          },
          {
            path: "estimate",
            name: "TravelFormEdit-EstimateTab",
            component: () => import("../views/travel-form-edit/EstimateTab"),
            props: true,
          },
        ],
      },
      {
        name: "TravelFormManagerList",
        path: "/managerView",
        meta: {
          requiresAuth: true,
        },
        component: () => import("../views/ManagerView"),
      },
      {
        name: "travelRequestManage",
        path: "request/:formId?/manage",
        meta: {
          requiresAuth: true,
        },
        component: () => import("../views/TravelFormManage"),
      },
    ],
  },
]

export default routes
