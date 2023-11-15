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
          import("@/modules/travel-authorizations/layouts/ReadMyTravelAuthorizationLayout"),
        props: true,
        children: [
          {
            path: "",
            redirect: "details",
          },
          {
            path: "details",
            name: "ReadMyTravelAuthorizationDetailsPage",
            component: () =>
              import("@/modules/travel-authorizations/pages/ReadMyTravelAuthorizationDetailsPage"),
            props: true,
          },
          {
            path: "estimate",
            name: "ReadMyTravelAuthorizationEstimatePage",
            component: () =>
              import("@/modules/travel-authorizations/pages/ReadMyTravelAuthorizationEstimatePage"),
            props: true,
          },
        ],
      },
      {
        path: ":formId/edit",
        component: () =>
          import("@/modules/travel-authorizations/layouts/EditMyTravelAuthorizationLayout"),
        props: true,
        children: [
          {
            path: "",
            redirect: "details",
          },
          {
            path: "details",
            name: "EditMyTravelAuthorizationDetailsPage",
            component: () =>
              import("@/modules/travel-authorizations/pages/EditMyTravelAuthorizationDetailsPage"),
            props: true,
          },
          {
            path: "estimate",
            name: "EditMyTravelAuthorizationEstimatePage",
            component: () =>
              import("@/modules/travel-authorizations/pages/EditMyTravelAuthorizationEstimatePage"),
            props: true,
          },
        ],
      },
      {
        name: "ManageTravelAuthorizationsPage",
        path: "/manager-view",
        meta: {
          requiresAuth: true,
        },
        component: () =>
          import("@/modules/travel-authorizations/pages/ManageTravelAuthorizationsPage"),
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
