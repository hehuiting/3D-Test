/*
 * @Author: heht
 * @Date: 2021-07-04 19:30:03
 * @LastEditors: heht
 * @LastEditTime: 2023-03-06 15:01:22
 * @Description:
 */
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/BaseTools",
    name: "BaseTools",
    component: () => import("@/views/BaseTools"),
  },
  {
    path: "/flyRoute",
    name: "FlyRouteut",
    component: () => import("@/views/FlyRoute"),
  },
  {
    path: "/iframe",
    name: "Iframe",
    component: () => import("@/views/Iframe"),
  },
  {
    path: "/Arcgis3D",
    name: "Arcgis3D",
    component: () => import("@/views/Arcgis3D"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
