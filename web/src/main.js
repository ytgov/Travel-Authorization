import Vue from "vue"
import VueApexCharts from "vue-apexcharts"

import App from "@/App"
import router from "@/router"
import store from "@/store"
import axios from "axios"
import "@/filters"
import Notifications from "@/components/Notifications"
import MapDialog from "@/components/MapDialog"
import vuetify from "@/plugins/vuetify"
import SnackPlugin from "@/plugins/snack-plugin"

import { Auth0Plugin } from "@/auth"

Vue.use(VueApexCharts)

Vue.use(Auth0Plugin, {
  // domain,
  // client_id: clientId,
  // audience,
  onRedirectCallback: (appState) => {
    router.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname)
  },
})
Vue.use(SnackPlugin)

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.directive("yk-btn", {
  bind: function (el) {
    el.style.backgroundColor = "#a000bb"
    el.style.color = "#fff"
    el.style.fontWeight = "400"
    el.style.textTransform = "none"
    el.style.borderRadius = "0"
  },
})

Vue.component("notifier", Notifications)
Vue.component("map-dialog", MapDialog)
Vue.component("apexchart", VueApexCharts)

axios.defaults.withCredentials = true
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*"

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app")
