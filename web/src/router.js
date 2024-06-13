import Vue from "vue"
import VueRouter from "vue-router"

import AdminUserForm from "@/components/Administration/UserManagement/UserComponent/Form"
import AdminDashboard from "@/components/Administration/Administration"
import UserManagement from "@/components/Administration/UserManagement/Grid"
import FlightEstimate from "@/components/Administration/RatesEstimateManagement/AirEstimate"
import PoolCarCost from "@/components/Administration/RatesEstimateManagement/PoolCarCost"
import RentalCarEstimates from "@/components/Administration/RatesEstimateManagement/RentalCarEstimate"
import YGRates from "@/components/Administration/RatesEstimateManagement/YGRates"
import TravelAgents from "@/components/Administration/LookupTableManagement/TravelAgents"

import preapprovedRouter from "@/modules/preapproved/router"
import travelDeskRouter from "@/modules/travelDesk/router"
import travelAuthorizationsRouter from "@/modules/travel-authorizations/router"
import flightExpenseRouter from "@/modules/flightExpenses/router"
import reportsRouter from "@/modules/reports/router"

Vue.use(VueRouter)

const routes = [
  {
    path: "",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        name: "Dashboard",
        path: "dashboard",
        meta: { requiresAuth: true },
        component: () => import("@/pages/DashboardPage"),
      },
      {
        name: "Profile",
        path: "profile",
        meta: { requiresAuth: true },
        component: () => import("@/pages/UserProfilePage"),
      },

      // CONSIDER: moving these into modules, or moving all route definitions into this file
      {
        path: "admin/users/view/:id",
        name: "AdminUserView",
        component: AdminUserForm,
      },
      {
        path: "administration/users/edit/:id",
        name: "AdminUserEdit",
        component: AdminUserForm,
      },
      {
        path: "administration",
        name: "AdminDashboard",
        component: AdminDashboard,
      },
      {
        path: "administration/users",
        name: "User Management",
        component: UserManagement,
      },
      {
        path: "administration/flightEstimate",
        name: "FlightEstimate",
        component: FlightEstimate,
      },
      {
        path: "administration/poolCarCost",
        name: "PoolCarCost",
        component: PoolCarCost,
      },
      {
        path: "administration/rentalCarEstimates",
        name: "RentalCarEstimates",
        component: RentalCarEstimates,
      },
      {
        path: "administration/ygRates",
        name: "YGRates",
        component: YGRates,
      },
      {
        path: "administration/TravelAgents",
        name: "TravelAgents",
        meta: {
          requiresAuth: true,
        },
        component: TravelAgents,
      },
      {
        path: "qa/scenarios",
        name: "Qa-Scenarios",
        component: () => import("@/pages/qa/ScenariosListPage"),
      },
      {
        path: "health-check",
        name: "HealthCheck",
        component: () => import("@/pages/HealthCheckPage"),
      },
    ],
  },

  ...preapprovedRouter,
  ...travelDeskRouter,
  ...travelAuthorizationsRouter,
  ...flightExpenseRouter,
  ...reportsRouter,

  {
    path: "/",
    component: () => import("@/layouts/BlankLayout"),
    children: [
      {
        name: "SignInPage",
        path: "sign-in",
        component: () => import("@/pages/SignInPage.vue"),
      },
    ],
  },
  {
    path: "*",
    name: "Not Found",
    component: () => import("@/pages/NotFoundPage"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
