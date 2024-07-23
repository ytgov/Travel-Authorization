import Vue from "vue"
import VueRouter from "vue-router"

import { authGuard } from "@/utils/auth-guard"

import AdminUserForm from "@/components/Administration/UserManagement/UserComponent/Form"
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
    path: "/",
    component: () => import("@/layouts/Layout"),
    children: [
      {
        path: "",
        redirect: "dashboard",
      },
      {
        name: "Dashboard",
        path: "dashboard",
        component: () => import("@/pages/DashboardPage"),
      },
      {
        name: "Profile",
        path: "profile",
        component: () => import("@/pages/UserProfilePage"),
      },
      {
        path: "administration",
        name: "AdministrationPage",
        component: () => import("@/pages/AdministrationPage"),
      },
      {
        path: "administration/users",
        name: "User Management",
        component: UserManagement,
      },
      {
        path: "administration/users/edit/:id",
        name: "AdminUserEdit",
        component: AdminUserForm,
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
        meta: { requiresAuth: false },
      },
    ],
  },

  ...preapprovedRouter,
  ...travelDeskRouter,
  ...travelAuthorizationsRouter,
  ...flightExpenseRouter,
  ...reportsRouter,

  {
    name: "SignInPage",
    path: "/sign-in",
    component: () => import("@/pages/SignInPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    name: "UnauthorizedPage",
    path: "/errors/unauthorized",
    component: () => import("@/pages/UnauthorizedPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "*",
    name: "Not Found",
    component: () => import("@/pages/NotFoundPage"),
    meta: { requiresAuth: false },
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth === false) return next()

  const isAuthenticated = await authGuard(to)
  if (isAuthenticated) return next()

  return next(false)
})

export default router
