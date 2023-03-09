import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../components/Dashboard.vue";
import NotFound from "../views/NotFound.vue";
import Form from "../components/Form";
import Login from "../views/Login";
import LoginComplete from "../views/LoginComplete";
import Profile from "../views/Profile";
import store from "../store";
import AdminUserForm from "../components/Administration/UserManagement/UserComponent/Form";
import AdminDashboard from "../components/Administration/Administration";
import UserManagement from "../components/Administration/UserManagement/Grid";
import FlightEstimate from "../components/Administration/RatesEstimateManagement/AirEstimate";
import PoolCarCost from "../components/Administration/RatesEstimateManagement/PoolCarCost";
import RentalCarEstimates from "../components/Administration/RatesEstimateManagement/RentalCarEstimate";
import YGRates from "../components/Administration/RatesEstimateManagement/YGRates";
import TravelAgents from "../components/Administration/LookupTableManagement/TravelAgents";
import Test from "../components/Test";
import HealthCheck from "../components/HealthCheck";

import preapprovedRouter from "../modules/preapproved/router/index.js";
import travelDeskRouter from "../modules/travelDesk/router/index.js";
import travelRequestRouter from "../modules/travelForm/router/index.js";

// import { authGuard } from "../auth/authGuard";

Vue.use(VueRouter);

const routes = [
  ...preapprovedRouter,
  ...travelDeskRouter,
  ...travelRequestRouter,
  {
    path: "/sign-in",
    name: "Login",
    component: Login
  },
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/form",
    name: "Basic Form",
    component: Form,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/login-complete",
    name: "LoginComplete",
    component: LoginComplete
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/admin/users/view/:id",
    name: "AdminUserView",
    component: AdminUserForm
  },
  {
    path: "/administration/users/edit/:id",
    name: "AdminUserEdit",
    component: AdminUserForm
  },
  {
    path: "/administration",
    name: "AdminDashboard",
    component: AdminDashboard
  },
  {
    path: "/administration/users",
    name: "User Management",
    component: UserManagement
  },
  {
    path: "*",
    name: "Not Found",
    component: NotFound
  },
  {
    path: "/administration/flightEstimate",
    name: "FlightEstimate",
    component: FlightEstimate
  },
  {
    path: "/administration/poolCarCost",
    name: "PoolCarCost",
    component: PoolCarCost
  },
  {
    path: "/administration/rentalCarEstimates",
    name: "RentalCarEstimates",
    component: RentalCarEstimates
  },
  {
    path: "/administration/ygRates",
    name: "YGRates",
    component: YGRates
  },
  {
    path: "/administration/TravelAgents",
    name: "TravelAgents",
    meta: {
      requiresAuth: true
    },
    component: TravelAgents
  },
  {
    path: "/test",
    name: "Test",
    component: Test
  },
  {
    path: "/healthCheck",
    name: "HealthCheck",
    component: HealthCheck
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  var requiresAuth = to.meta.requiresAuth || false;

  store.dispatch("setAppSidebar", to.path.startsWith("/sites/"));

  if (!requiresAuth) {
    return next();
  }

  await store.dispatch("checkAuthentication");
  var isAuthenticated = store.getters.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    console.log("You aren't authenticatd, redirecting to sign-in");
    next("/sign-in");
    return;
  }

  return next();
});

export default router;
