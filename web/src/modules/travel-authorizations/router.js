import { cast } from "@/utils/vue-router-utils"

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
        path: "manage-travel-requests",
        component: () =>
          import("@/modules/travel-authorizations/pages/ManageTravelAuthorizationsPage"),
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
          import("@/modules/travel-authorizations/layouts/TravelAuthorizationLayout.vue"),
        props: cast("travelAuthorizationId", parseInt),
        children: [
          {
            path: "",
            redirect: "details/edit",
          },
          {
            path: "details/edit",
            name: "EditTravelAuthorizationDetailsPage",
            component: () =>
              import("@/modules/travel-authorizations/pages/EditTravelAuthorizationDetailsPage"),
            props: cast("travelAuthorizationId", parseInt),
          },
          {
            path: "estimate/edit",
            name: "EditTravelAuthorizationEstimatePage",
            component: () =>
              import("@/modules/travel-authorizations/pages/EditTravelAuthorizationEstimatePage"),
            props: cast("travelAuthorizationId", parseInt),
          },
          {
            path: "expense/edit",
            name: "EditTravelAuthorizationExpensePage",
            component: () =>
              import("@/modules/travel-authorizations/pages/EditTravelAuthorizationExpensePage"),
            props: cast("travelAuthorizationId", parseInt),
          },
        ],
      },
      {
        path: ":travelAuthorizationId",
        component: () =>
          import("@/modules/travel-authorizations/layouts/ManageTravelAuthorizationLayout"),
        props: cast("travelAuthorizationId", parseInt),
        children: [
          {
            path: "",
            redirect: "details/manage",
          },
          {
            name: "ManageTravelAuthorizationDetailsPage",
            path: "details/manage",
            component: () =>
              import("@/modules/travel-authorizations/pages/ManageTravelAuthorizationDetailsPage"),
            props: cast("travelAuthorizationId", parseInt),
          },
          {
            path: "estimate/manage",
            name: "ManageTravelAuthorizationEstimatePage",
            component: () =>
              import("@/modules/travel-authorizations/pages/ManageTravelAuthorizationEstimatePage"),
            props: cast("travelAuthorizationId", parseInt),
          },
          {
            path: "expense/manage",
            name: "ManageTravelAuthorizationExpensePage",
            component: () =>
              import("@/modules/travel-authorizations/pages/ManageTravelAuthorizationExpensePage"),
            props: cast("travelAuthorizationId", parseInt),
          },
        ],
      },
    ],
  },
]

export default routes
