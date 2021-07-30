import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import FlyRoute from "../views/FlyRoute.vue";
import iframeComponent from "../views/Iframe";
import Arcgis3D from "../views/Arcgis3D";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/flyRoute",
    name: "FlyRouteut",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: FlyRoute,
  },
  {
    path: "/iframe",
    name: "Iframe",
    component: iframeComponent,
  },
  {
    path: "/Arcgis3D",
    name: "Arcgis3D",
    component: Arcgis3D,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
