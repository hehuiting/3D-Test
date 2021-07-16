import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import SceneViewer from "./components/SceneViewer.vue";
// import iview from "view-design";

Vue.config.productionTip = false;

Vue.component("scene-viewer", SceneViewer);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
