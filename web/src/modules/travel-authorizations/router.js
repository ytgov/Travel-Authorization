const routes = [
  {
    path: "/",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        name: "MyTravelAuthorizationsPage",
        path: "my-travel-requests",
        component: () => import("@/modules/travel-authorizations/pages/MyTravelAuthorizationsPage"),
      },

      {
        name: "ManageTravelAuthorizationsPage",
        path: "manager-view",
        component: () =>
          import("@/modules/travel-authorizations/pages/ManageTravelAuthorizationsPage"),
      },
    ],
  },
  {
    path: "/my-travel-requests",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        path: ":formId",
        component: () =>
          import("@/modules/travel-authorizations/layouts/ReadMyTravelAuthorizationLayout"),
        props: (route) => ({ formId: parseInt(route.params.formId) }),
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
        props: (route) => ({ formId: parseInt(route.params.formId) }),
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
    ],
  },
  {
    path: "/travel-requests",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        path: ":travelAuthorizationId",
        component: () =>
          import("@/modules/travel-authorizations/layouts/ManageTravelAuthorizationLayout"),
        props: (route) => ({ travelAuthorizationId: parseInt(route.params.travelAuthorizationId) }),
        children: [
          {
            path: "",
            redirect: "details",
          },
          {
            name: "ManageTravelAuthorizationDetails",
            path: "details",
            component: () =>
              import("@/modules/travel-authorizations/pages/ManageTravelAuthorizationDetails"),
            props: true,
          },
        ],
      },
    ],
  },
]

export default routes
