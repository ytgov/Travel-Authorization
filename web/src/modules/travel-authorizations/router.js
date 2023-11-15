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
        component: () => import("@/modules/travel-authorizations/pages/TravelFormList"),
      },
      {
        path: ":formId",
        component: () => import("@/modules/travel-authorizations/pages/TravelAuthorizationRead"),
        props: true,
        children: [
          {
            path: "",
            redirect: "details",
          },
          {
            path: "details",
            name: "TravelAuthorizationRead-DetailsTab",
            component: () =>
              import("@/modules/travel-authorizations/pages/travel-authorization-read/DetailsTab"),
            props: true,
          },
          {
            path: "estimate",
            name: "TravelAuthorizationRead-EstimateTab",
            component: () =>
              import("@/modules/travel-authorizations/pages/travel-authorization-read/EstimateTab"),
            props: true,
          },
        ],
      },
      {
        path: ":formId/edit",
        component: () => import("@/modules/travel-authorizations/pages/TravelAuthorizationEdit"),
        props: true,
        children: [
          {
            path: "",
            redirect: "details",
          },
          {
            path: "details",
            name: "TravelAuthorizationEdit-DetailsTab",
            component: () =>
              import("@/modules/travel-authorizations/pages/travel-authorization-edit/DetailsTab"),
            props: true,
          },
          {
            path: "estimate",
            name: "TravelAuthorizationEdit-EstimateTab",
            component: () =>
              import("@/modules/travel-authorizations/pages/travel-authorization-edit/EstimateTab"),
            props: true,
          },
        ],
      },
      {
        name: "ManagerView",
        path: "/manager-view",
        meta: {
          requiresAuth: true,
        },
        component: () => import("@/modules/travel-authorizations/pages/ManagerView"),
      },
      {
        name: "travelRequestManage",
        path: "request/:formId?/manage",
        meta: {
          requiresAuth: true,
        },
        component: () => import("@/modules/travel-authorizations/pages/TravelFormManage"),
      },
    ],
  },
]

export default routes
