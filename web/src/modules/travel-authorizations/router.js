const routes = [
  {
    path: "/my-travel-requests",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        name: "MyTravelAuthorizationsPage",
        path: "",
        meta: {
          requiresAuth: true,
        },
        component: () => import("@/modules/travel-authorizations/pages/MyTravelAuthorizationsPage"),
      },
      {
        path: ":formId",
        component: () =>
          import("@/modules/travel-authorizations/layouts/MyTravelAuthorizationReadLayout"),
        props: true,
        children: [
          {
            path: "",
            redirect: "details",
          },
          {
            path: "details",
            name: "MyTravelAuthorizationReadDetailsPage",
            component: () =>
              import("@/modules/travel-authorizations/pages/MyTravelAuthorizationReadDetailsPage"),
            props: true,
          },
          {
            path: "estimate",
            name: "MyTravelAuthorizationReadEstimatePage",
            component: () =>
              import("@/modules/travel-authorizations/pages/MyTravelAuthorizationReadEstimatePage"),
            props: true,
          },
        ],
      },
      {
        path: ":formId/edit",
        component: () =>
          import("@/modules/travel-authorizations/layouts/MyTravelAuthorizationEditLayout"),
        props: true,
        children: [
          {
            path: "",
            redirect: "details",
          },
          {
            path: "details",
            name: "MyTravelAuthorizationEditDetailsPage",
            component: () =>
              import("@/modules/travel-authorizations/pages/MyTravelAuthorizationEditDetailsPage"),
            props: true,
          },
          {
            path: "estimate",
            name: "MyTravelAuthorizationEditEstimatePage",
            component: () =>
              import("@/modules/travel-authorizations/pages/MyTravelAuthorizationEditEstimatePage"),
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
