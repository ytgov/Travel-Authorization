import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "./filters";
import Notifications from "./components/Notifications";
import MapDialog from "./components/MapDialog";
import vuetify from "./plugins/vuetify";

import { domain, clientId, audience } from "../auth_config.json";

import { Auth0Plugin } from "./auth";

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.directive("yk-btn", {
  bind: function(el) {
    el.style.backgroundColor = "#a000bb";
    el.style.color = "#fff";
    el.style.fontWeight = "400";
    el.style.textTransform = "none";
    el.style.borderRadius = "0";
  }
});

Vue.component("notifier", Notifications);
Vue.component("map-dialog", MapDialog);

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
