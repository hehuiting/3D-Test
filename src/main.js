import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import SupermapMap from "./components/SupermapMap.vue";
import ArcgisMap from "./components/ArcgisMap.vue";

// import iview from "view-design";

Vue.config.productionTip = false;

Vue.component("supermap-map", SupermapMap);
Vue.component("arcgis-map", ArcgisMap);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
